import { BaseComponent, Component } from "@flamework/components";
import { OnRender, OnStart } from "@flamework/core";
import CameraShaker from "@rbxts/camera-shaker";
import { CharacterRigR15 } from "@rbxts/promise-character";
import { Players, RunService, UserInputService, Workspace } from "@rbxts/services";
import { Events, Functions } from "client/network";
import { clientStore } from "client/store";
import { selectCameraBias, selectCameraOffset } from "client/store/camera";
import { FirearmAnimations, FirearmLike, FirearmSoundManager, FirearmSounds } from "shared/constants/weapons";
import { FirearmState } from "shared/constants/weapons/state";
import { selectWeapon } from "shared/store/combat";
import { AnimationUtil, Indexable } from "shared/utils";
import { ControlSet } from "./controls";

export interface FirearmInstance extends Tool {}

export interface FirearmAttributes {}

const player = Players.LocalPlayer;
const camera = Workspace.CurrentCamera!;

const CAMERA_X_OFFSET = 1;
const CAMERA_Z_OFFSET = 0.2;

@Component({
	tag: "baseFirearm",
	refreshAttributes: false,
})
export class BaseFirearm<A extends FirearmAttributes, I extends FirearmInstance>
	extends BaseComponent<A, I>
	implements OnStart, OnRender
{
	configuration: FirearmLike;
	character = (player.Character ?? player.CharacterAdded.Wait()[0]) as CharacterRigR15;

	controls = new ControlSet();
	loadedAnimations!: FirearmAnimations<AnimationTrack>;

	firing = false;
	burstFiring = false;

	aiming = false;

	loaded = false;
	equipped = false;
	connections: Indexable<"activated" | "equipped" | "unequipped" | "loop", RBXScriptConnection> = {} as any;

	recoil = new CameraShaker(Enum.RenderPriority.Camera.Value, (shakeCFrame) => clientStore.setRecoil(shakeCFrame));

	state!: FirearmState | undefined;
	soundManager: FirearmSoundManager<FirearmSounds>;

	constructor() {
		super();
		this.configuration = this.getConfiguration();
		this.soundManager = new FirearmSoundManager(this.configuration.sounds, this.instance);
	}

	onStart() {
		this.load();

		this.connections.activated = this.instance.Activated.Connect(() => {
			if (this.state?.cooldown || this.state?.magazine === undefined) {
				return;
			}
			this.fire();
		});

		this.connections.equipped = this.instance.Equipped.Connect(() => {
			this.equip();
		});

		this.connections.unequipped = this.instance.Unequipped.Connect(() => {
			this.unequip();
		});

		this.connections.loop = RunService.RenderStepped.Connect(() => {
			if (!this.state) {
				return;
			}
			this.configuration = this.state.configuration as FirearmLike;
		});

		coroutine.resume(
			coroutine.create(() => {
				while (wait(60 / this.configuration.Barrel.rpm)[0]) {
					if (this.state?.cooldown || this.state?.magazine === undefined) {
						continue;
					}
					if (!this.firing || this.state.mode !== "Automatic") {
						continue;
					}
					this.fire();
				}
			}),
		);
	}

	load() {
		this.loadAnimations();

		clientStore.subscribe(selectWeapon(player.UserId), (weapon) => {
			this.state = weapon as FirearmState | undefined;
		});

		this.loaded = true;
	}

	private getConfiguration() {
		return require(this.instance.FindFirstChildOfClass("ModuleScript") as ModuleScript) as FirearmLike;
	}

	loadAnimations() {
		this.loadedAnimations = AnimationUtil.convertDictionaryToTracks(
			this.configuration.animations,
			this.character.Humanoid,
		) as FirearmAnimations<AnimationTrack>;
	}

	fire() {
		const fired = Functions.FireFirearm.invoke(this.instance, player.GetMouse().Hit.Position).expect();
		if (fired) {
			this.recoil.ShakeOnce(math.random(1, 2.5), math.random(3, 5), 0.1, 0.05);
		}
	}

	loadBinds() {
		this.controls.add({
			ID: `fire-${this.instance.Name}`,
			Name: "Fire",
			Enabled: false,
			Mobile: false,
			controls: [Enum.UserInputType.MouseButton1, Enum.KeyCode.ButtonR2],

			once: (state) => (this.firing = state === Enum.UserInputState.Begin),

			onBegin: () => {
				if (this.state?.cooldown || this.state?.magazine === undefined) {
					return;
				}

				switch (this.state.mode) {
					case "Semi-Automatic": {
						this.fire();
						break;
					}

					case "Burst": {
						if (this.burstFiring) {
							break;
						}
						this.burstFiring = true;
						for (let i = 0; i < this.configuration.Barrel.burstCount; i++) {
							this.fire();
						}
						this.burstFiring = false;
						break;
					}

					default:
						break;
				}
			},

			onEnd: () => (this.firing = false),
		});

		if (UserInputService.TouchEnabled) {
			UserInputService.TouchTap.Connect((touchPositions, gameProcessedEvent) => {
				if (this.state?.cooldown || this.state?.magazine === undefined || gameProcessedEvent) {
					return;
				}
				this.fire();
			});
		}

		this.controls.add({
			ID: `reload-${this.instance.Name}`,
			Name: "Reload",
			Enabled: false,
			Mobile: true,
			controls: [Enum.KeyCode.R, Enum.KeyCode.ButtonB],

			onBegin: () => {
				Events.ReloadFirearm.fire(this.instance);
			},
		});

		this.controls.add({
			ID: `aim-${this.instance.Name}`,
			Name: "Aim",
			Enabled: false,
			Mobile: false,
			controls: [Enum.UserInputType.MouseButton2, Enum.KeyCode.ButtonL2],

			onBegin: () => {
				this.aimIn();
			},

			onEnd: () => {
				this.aimOut();
			},

			priority: 1,
		});

		this.controls.add({
			ID: `switchShoulderLeft-${this.instance.Name}`,
			Name: "Left Lean",
			Enabled: false,
			Mobile: false,
			controls: [Enum.KeyCode.Q, Enum.KeyCode.DPadLeft],

			onBegin: () => {
				if (this.aiming) {
					clientStore.setCameraBias({ left: true, right: false });
				}
			},
		});

		this.controls.add({
			ID: `switchShoulderRight-${this.instance.Name}`,
			Name: "Right Lean",
			Enabled: false,
			Mobile: false,
			controls: [Enum.KeyCode.E, Enum.KeyCode.DPadRight],

			onBegin: () => {
				if (this.aiming) {
					clientStore.setCameraBias({ left: false, right: true });
				}
			},
		});
	}

	equip() {
		this.loadBinds();
		this.loadedAnimations.Idle.Play();

		clientStore.setCameraLockedCenter(true);
		clientStore.setShiftLocked(false);
		clientStore.setFovOffset(0);
		clientStore.setCameraFlag("FirearmIsAiming", false);
		this.recoil.Start();

		this.equipped = true;
	}

	unequip() {
		this.unloadBinds();

		AnimationUtil.stopAll(this.loadedAnimations);

		clientStore.setCameraLockedCenter(false);
		clientStore.setCameraFlag("FirearmIsAiming", false);

		this.aiming = false;
		clientStore.setShiftLocked(false);
		clientStore.setCameraOffset(Vector3.zero);
		clientStore.setExtraCameraOffset(Vector3.zero);
		clientStore.setFovOffset(0);
		clientStore.setWalkspeedMultiplier(1);
		this.recoil.Stop();

		this.equipped = false;
	}

	aimIn() {
		this.soundManager.play("AimIn");

		clientStore.setShiftLocked(true);
		clientStore.setCameraFlag("FirearmIsAiming", true);
		this.character.Humanoid.WalkSpeed = this.character.Humanoid.WalkSpeed * 0.25;
		clientStore.setWalkspeedMultiplier(0.25);

		this.aiming = true;
	}

	aimOut() {
		this.soundManager.play("AimOut");

		clientStore.setShiftLocked(false);
		clientStore.setCameraFlag("FirearmIsAiming", false);
		clientStore.setFovOffset(0);
		clientStore.setWalkspeedMultiplier(1);

		this.aiming = false;
	}

	unloadBinds() {
		this.controls.remove(`fire-${this.instance.Name}`);
		this.controls.remove(`reload-${this.instance.Name}`);
		this.controls.remove(`aim-${this.instance.Name}`);
		this.controls.remove(`switchShoulderLeft-${this.instance.Name}`);
		this.controls.remove(`switchShoulderRight-${this.instance.Name}`);

		this.aiming = false;
		clientStore.setShiftLocked(false);
		clientStore.setFovOffset(0);
	}

	onRender(dt: number) {
		if (!this.equipped) {
			return;
		}

		const state = clientStore.getState();

		const bias = CAMERA_X_OFFSET * (selectCameraBias(state).right ? 1 : -1);
		const targetAimOffset = new Vector3(bias, CAMERA_Z_OFFSET, -1.8);
		const currentAimOffset = selectCameraOffset(state);

		const aimOffsetIsDifferent = currentAimOffset !== targetAimOffset;
		if (this.aiming && aimOffsetIsDifferent) {
			clientStore.setCameraOffset(targetAimOffset);
		} else if (!this.aiming) {
			clientStore.setCameraOffset(Vector3.zero);
		}

		if (this.aiming && !this.loadedAnimations.Aim.IsPlaying) {
			this.loadedAnimations.Idle.Stop();
			this.loadedAnimations.Aim.Play();
		} else if (!this.aiming && this.loadedAnimations.Aim.IsPlaying) {
			this.loadedAnimations.Aim.Stop();
			this.loadedAnimations.Idle.Play();
		}
	}
}
