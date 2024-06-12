import { BaseComponent, Component } from "@flamework/components";
import { OnRender, OnStart } from "@flamework/core";
import CameraShaker from "@rbxts/camera-shaker";
import Log from "@rbxts/log";
import Maid from "@rbxts/maid";
import { CharacterRigR15 } from "@rbxts/promise-character";
import { Players, RunService, UserInputService } from "@rbxts/services";
import { Events, Functions } from "client/network";
import { clientStore } from "client/store";
import { selectCameraBias, selectCameraOffset } from "client/store/camera";
import { selectSprinting } from "client/store/character";
import { FirearmAnimations, FirearmLike, FirearmSoundManager, FirearmSounds } from "shared/constants/weapons";
import { FirearmState } from "shared/constants/weapons/state";
import { selectWeapon } from "shared/store/combat";
import { AnimationUtil, ExtendedMaid } from "shared/utils";
import { ControlSet } from "./controls";

export interface FirearmInstance extends Tool {}

export interface FirearmAttributes {}

const player = Players.LocalPlayer;

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
	debug = false;
	connections = new ExtendedMaid<
		"activated" | "updateInfo" | "equipped" | "unequipped" | "loop" | "onClean" | "unload"
	>();

	recoil: CameraShaker;

	state!: FirearmState | undefined;
	soundManager: FirearmSoundManager<FirearmSounds>;

	maid = new Maid();

	constructor() {
		super();
		this.configuration = this.getConfiguration();
		this.soundManager = new FirearmSoundManager(this.configuration.sounds, this.instance);
		this.recoil = new CameraShaker(Enum.RenderPriority.Camera.Value, (shakeCFrame) =>
			clientStore.setRecoil(shakeCFrame),
		);
	}

	injectConnections() {
		Log.Warn("Injecting connections | BaseFirearm->injectConnections");

		this.connections.setTask(
			"onClean",
			UserInputService.InputBegan.Connect((inp) => {
				if (inp.KeyCode === Enum.KeyCode.K) {
					Log.Warn("Hello from {@Component}", this.configuration.name);
				}
			}),
		);

		this.connections.setTask(
			"unload",
			Events.UnloadWeapon.connect(() => {
				this.unload();
			}),
		);

		this.connections.setTask(
			"activated",
			this.instance.Activated.Connect(() => {
				if (!this.state || this.state.cooldown) {
					Log.Warn(
						"State Defined: {@State} | cooldown: {@Cooldown} | magazine: {@Magazine}",
						this.state,
						this.state?.cooldown,
					);
					return;
				}
				this.fire();
			}),
		);

		this.connections.setTask(
			"equipped",
			Events.ToggleWeaponEquip.connect((equipped) => {
				if (equipped) {
					this.equip();
				} else {
					this.unequip();
				}
			}),
		);

		this.connections.setTask(
			"loop",
			RunService.RenderStepped.Connect(() => {
				if (!this.state) {
					return;
				}
				this.configuration = this.state.configuration as FirearmLike;
			}),
		);

		this.connections.setThread(
			task.spawn(() => {
				while (task.wait(60 / this.configuration.barrel.rpm)) {
					if (!this.firing || !this.state || this.state.cooldown || this.state.mode !== "Automatic") {
						if (!this.state) {
							Log.Warn("No State");
						} else if (!this.firing && this.debug) {
							Log.Warn("not Firing");
						}
						continue;
					}

					this.fire();
				}
			}),
		);
	}

	onStart() {
		Functions.LoadWeapon.setCallback((weapon) => {
			if (weapon === this.instance) {
				Log.Warn("Loading | BaseFirearm->onStart");
				this.load();
				return true;
			}

			return false;
		});
	}

	load() {
		this.loadAnimations();

		clientStore.setLoadedWeapon(this);

		this.maid.GiveTask(() => {
			clientStore.subscribe(selectSprinting, (sprinting) => {
				if (sprinting) {
					this.loadedAnimations.Run.Play();
				} else {
					this.loadedAnimations.Run.Stop();
				}
			});
		});

		clientStore.subscribe(selectWeapon(player.UserId), (weaponState, oldWeaponState) => {
			if (oldWeaponState !== undefined && weaponState === undefined) {
				return;
			}

			if (!this.connections.hasTasks()) {
				this.injectConnections();
			}

			this.state = weaponState as FirearmState | undefined;
		});

		this.loaded = true;
	}

	unload() {
		Log.Warn("Unloading | BaseFirearm->unload");
		this.unequip();
		clientStore.setLoadedWeapon(undefined);
		this.connections.clean();
		this.state = undefined;
		this.loaded = false;
		this.destroy();
	}

	private getConfiguration() {
		const configModule = this.instance.WaitForChild("Config") as ModuleScript;
		if (!configModule) {
			throw `No configuration module found for ${this.instance.Name} `;
		}
		const config = require(configModule) as FirearmLike;
		return config;
	}

	loadAnimations() {
		this.loadedAnimations = AnimationUtil.convertDictionaryToTracks(
			this.configuration.animations,
			this.character.Humanoid.Animator,
		) as FirearmAnimations<AnimationTrack>;
	}

	fire() {
		const [success, fired] = Functions.FireFirearm.invoke(this.instance, player.GetMouse().Hit.Position).await();
		if (!success) {
			throw "Failed to fire firearm.";
		} else if (!fired) {
			Log.Warn("Failed to fire firearm | BaseFirearm->fire");
			return;
		}

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
				switch (this.state?.mode ?? "Automatic") {
					case "Semi-Automatic": {
						this.fire();
						break;
					}

					case "Burst": {
						if (this.burstFiring) {
							break;
						}
						this.burstFiring = true;
						for (let i = 0; i < this.configuration.barrel.burstCount; i++) {
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
			ID: "weapon-debug",
			Name: "Deubg",
			Enabled: false,
			Mobile: false,
			controls: [Enum.KeyCode.KeypadFive],

			onBegin: () => (this.debug = true),

			onEnd: () => (this.debug = false),
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
		clientStore.setWeaponEquipped(true);
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
		clientStore.setEquippedWeaponInfo(undefined);
		clientStore.setWeaponEquipped(false);
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
