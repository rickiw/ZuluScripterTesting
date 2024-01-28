import { BaseComponent, Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { Players, RunService, UserInputService } from "@rbxts/services";
import { ObjectUtils } from "@rbxts/variant/out/ObjectUtils";
import { clientStore } from "client/store";
import { ControlSet } from "client/types/ControlSet";
import { selectWeapon } from "shared/data/selectors/combat";
import { GlobalEvents } from "shared/network";
import { FirearmAnimations, FirearmLike } from "shared/types/combat/FirearmWeapon";
import { FirearmState } from "shared/types/combat/FirearmWeapon/FirearmState";
import { Indexable } from "shared/types/util";
import { AnimationUtil } from "shared/utils/animation";
import { PlayerCharacterR15 } from "../../../../CharacterTypes";

export interface FirearmInstance extends Tool {}
export interface FirearmAttributes {}

@Component({ tag: "baseFirearm", refreshAttributes: false })
export class BaseFirearm<A extends FirearmAttributes, I extends FirearmInstance>
	extends BaseComponent<A, I>
	implements OnStart
{
	configuration: FirearmLike;
	wielder = Players.LocalPlayer;
	char = (this.wielder.Character || this.wielder.CharacterAdded.Wait()[0]) as PlayerCharacterR15;

	net = GlobalEvents.createClient({});
	controls = new ControlSet();

	loadedAnimations!: FirearmAnimations<AnimationTrack>;

	firing = false;
	burstFiring = false;

	loaded: boolean = false;
	connections: Indexable<string, RBXScriptConnection> = {};

	state!: FirearmState | undefined;
	constructor() {
		super();
		this.configuration = this.getConfiguration();
	}

	onStart() {
		this.load();

		this.connections.equipped = this.instance.Equipped.Connect(() => {
			this.loadBinds();
			this.loadedAnimations.Idle.Play();
		});

		this.connections.unequipped = this.instance.Unequipped.Connect(() => {
			this.unloadBinds();
			this.loadedAnimations.Idle.Stop();
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
			Mobile: false,
			controls: [Enum.KeyCode.R, Enum.KeyCode.ButtonB],

			onBegin: () => {
				this.net.ReloadFirearm.fire(this.instance);
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
	}

	loadAnimations() {
		if (!this.char) return;
		this.char.WaitForChild("Humanoid");
		this.loadedAnimations = AnimationUtil.convertDictionaryToTracks(
			this.configuration.animations,
			this.char.Humanoid,
		) as FirearmAnimations<AnimationTrack>;
	}
}
