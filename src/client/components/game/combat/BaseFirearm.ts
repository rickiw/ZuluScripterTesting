import { BaseComponent, Component } from "@flamework/components";
import { OnStart, OnTick } from "@flamework/core";
import { Players, RunService, UserInputService } from "@rbxts/services";
import { ObjectUtils } from "@rbxts/variant/out/ObjectUtils";
import { clientStore } from "client/store";
import { selectCameraOffset } from "client/store/camera";
import { ControlSet } from "client/types/ControlSet";
import { selectWeapon } from "shared/data/selectors/combat";
import { GlobalEvents } from "shared/network";
import { FirearmAnimations, FirearmLike, FirearmSounds } from "shared/types/combat/FirearmWeapon";
import { FirearmState } from "shared/types/combat/FirearmWeapon/FirearmState";
import { Indexable } from "shared/types/util";
import { AnimationUtil } from "shared/utils/animation";
import { SoundCache, SoundDict, SoundUtil } from "shared/utils/sound";
import { PlayerCharacterR15 } from "../../../../CharacterTypes";

export interface FirearmInstance extends Tool {}
export interface FirearmAttributes {}

@Component({ tag: "baseFirearm", refreshAttributes: false })
export class BaseFirearm<A extends FirearmAttributes, I extends FirearmInstance>
	extends BaseComponent<A, I>
	implements OnStart, OnTick
{
	configuration: FirearmLike;
	wielder = Players.LocalPlayer;
	char = (this.wielder.Character || this.wielder.CharacterAdded.Wait()[0]) as PlayerCharacterR15;

	net = GlobalEvents.createClient({});
	controls = new ControlSet();

	loadedAnimations!: FirearmAnimations<AnimationTrack>;

	firing = false;
	burstFiring = false;

	aiming = false;
	bias = [true, false];

	loaded: boolean = false;
	equipped = false;
	connections: Indexable<string, RBXScriptConnection> = {};

	state!: FirearmState | undefined;
	loadedSounds: FirearmSounds<SoundCache>;
	constructor() {
		super();
		this.configuration = this.getConfiguration();
		this.loadedSounds = SoundUtil.convertDictToSoundCacheDict(
			this.configuration.sounds as SoundDict<number | string>,
			{ parent: this.instance, volume: 3 },
		) as FirearmSounds<SoundCache>;
	}

	onStart() {
		this.load();

		this.connections.equipped = this.instance.Equipped.Connect(() => {
			this.loadBinds();
			this.loadedAnimations.Idle.Play();
			clientStore.setCameraLockedCenter(true);
			clientStore.setCameraFlag("FirearmIsEquipped", true);

			this.equipped = true;
		});

		this.connections.unequipped = this.instance.Unequipped.Connect(() => {
			this.unloadBinds();
			this.loadedAnimations.Idle.Stop();
			clientStore.setCameraLockedCenter(false);
			clientStore.setCameraFlag("FirearmIsEquipped", false);

			this.equipped = false;
		});

		this.connections.loop = RunService.RenderStepped.Connect(() => {
			if (!this.state) return;
			this.configuration = this.state.configuration as FirearmLike;
		});

		coroutine.resume(
			coroutine.create(() => {
				while (wait(60 / this.configuration.Barrel.rpm)[0]) {
					if (this.state?.cooldown || this.state?.magazine === undefined) continue;
					if (!this.firing || this.state.mode !== "Automatic") continue;
					this.fire();
				}
			}),
		);
	}

	getConfiguration(): FirearmLike {
		return require(this.instance.FindFirstChildOfClass("ModuleScript") as ModuleScript) as FirearmLike;
	}

	load() {
		this.loadAnimations();

		clientStore.subscribe(selectWeapon(this.wielder.UserId), (weapon) => {
			this.state = weapon as FirearmState | undefined;
		});
		this.loaded = true;
	}

	unload() {
		for (const k of ObjectUtils.keys(this.connections)) this.connections[k].Disconnect();
		this.loaded = false;
	}

	loadBinds() {
		this.controls.add({
			// differentiate by name so multiple weapons can have binds (and for general stability)
			ID: `fire-${this.instance.Name}`,
			Name: "Fire",
			Enabled: false,
			Mobile: false,
			controls: [Enum.UserInputType.MouseButton1, Enum.KeyCode.ButtonR2],

			once: (state) => (this.firing = state === Enum.UserInputState.Begin),

			onBegin: () => {
				if (this.state?.cooldown || this.state?.magazine === undefined) return;

				switch (this.state.mode) {
					case "Semi-Automatic": {
						this.fire();
						break;
					}

					case "Burst": {
						if (this.burstFiring) break;
						this.burstFiring = true;
						for (let i = 0; i < this.configuration.Barrel.burstCount; i++) this.fire();
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
				if (this.state?.cooldown || this.state?.magazine === undefined || gameProcessedEvent) return;
				this.loadedAnimations.Fire.Play();
				this.net.FireFirearm.fire(this.instance, this.wielder.GetMouse().Hit.Position);
			});
		}

		this.controls.add({
			// differentiate by name so multiple weapons can have binds (and for general stability)
			ID: `reload-${this.instance.Name}`,
			Name: "Reload",
			Enabled: false,
			Mobile: true,
			controls: [Enum.KeyCode.R, Enum.KeyCode.ButtonB],

			onBegin: () => {
				this.net.ReloadFirearm.fire(this.instance);
			},
		});

		this.controls.add({
			// differentiate by name so multiple weapons can have binds (and for general stability)
			ID: `aim-${this.instance.Name}`,
			Name: "Aim",
			Enabled: false,
			Mobile: false,
			controls: [Enum.UserInputType.MouseButton2, Enum.KeyCode.ButtonL2],

			onBegin: () => {
				this.loadedSounds.AimIn.play();
				this.aiming = true;
				clientStore.setShiftLocked(true);
				clientStore.setFovOffset(-40);
				clientStore.setCameraFlag("FirearmIsAiming", true);
			},

			onEnd: () => {
				this.loadedSounds.AimOut.play();
				this.aiming = false;
				clientStore.setShiftLocked(false);
				clientStore.setFovOffset(0);
				clientStore.setCameraFlag("FirearmIsAiming", false);
			},

			priority: 1,
		});

		this.controls.add({
			// differentiate by name so multiple weapons can have binds (and for general stability)
			ID: `switchShoulderLeft-${this.instance.Name}`,
			Name: "Lean Left",
			Enabled: false,
			Mobile: false,
			controls: [Enum.KeyCode.Q, Enum.KeyCode.DPadLeft],

			onBegin: () => {
				this.bias[0] = !this.bias[0];
				if (this.bias[0] && this.bias[1]) this.bias[1] = false;
			},
		});

		this.controls.add({
			// differentiate by name so multiple weapons can have binds (and for general stability)
			ID: `switchShoulderRight-${this.instance.Name}`,
			Name: "Lean Right",
			Enabled: false,
			Mobile: false,
			controls: [Enum.KeyCode.E, Enum.KeyCode.DPadRight],

			onBegin: () => {
				this.bias[1] = !this.bias[1];
				if (this.bias[0] && this.bias[1]) this.bias[0] = false;
			},
		});
	}

	fire() {
		// if (this.state?.magazine.holding === 0) return;
		this.loadedAnimations.Fire.Play();
		this.net.FireFirearm.fire(this.instance, this.wielder.GetMouse().Hit.Position);
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

	loadAnimations() {
		if (!this.char) return;
		this.char.WaitForChild("Humanoid");
		this.loadedAnimations = AnimationUtil.convertDictionaryToTracks(
			this.configuration.animations,
			this.char.Humanoid,
		) as FirearmAnimations<AnimationTrack>;
	}

	onTick(dt: number) {
		const State = clientStore.getState();
		const TargetAimOffset = new Vector3(1.25 * (this.bias[0] === true && this.bias[1] === false ? 1 : -1), 0, 0);
		if (this.aiming && selectCameraOffset(State) !== TargetAimOffset && this.equipped)
			clientStore.setCameraOffset(TargetAimOffset);
		else if (!this.aiming && selectCameraOffset(State) === TargetAimOffset && this.equipped)
			clientStore.setCameraOffset(Vector3.zero);

		if (this.aiming && !this.loadedAnimations.Aim.IsPlaying) {
			this.loadedAnimations.Aim.Play();
			this.loadedAnimations.Idle.Stop();
		}

		if (!this.aiming && this.loadedAnimations.Aim.IsPlaying) {
			this.loadedAnimations.Aim.Stop();
			this.loadedAnimations.Idle.Play();
		}
	}
}
