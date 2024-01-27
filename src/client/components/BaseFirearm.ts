import { BaseComponent, Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { CharacterRigR15 } from "@rbxts/promise-character";
import { Players } from "@rbxts/services";
import { Events } from "client/network";
import { clientStore } from "client/store";
import { FirearmAnimations, FirearmLike } from "shared/constants/weapons";
import { FirearmState } from "shared/constants/weapons/state";
import { selectCombatState } from "shared/store/combat";
import { AnimationUtil, Indexable } from "shared/utils";

export interface FirearmInstance extends Tool {}

export interface FirearmAttributes {}

const player = Players.LocalPlayer;

@Component({
	tag: "baseFirearm",
	refreshAttributes: false,
})
export class BaseFirearm<A extends FirearmAttributes, I extends FirearmInstance>
	extends BaseComponent<A, I>
	implements OnStart
{
	configuration: FirearmLike;
	wielder = player;
	character = (player.Character ?? player.CharacterAdded.Wait()[0]) as CharacterRigR15;

	loadedAnimations!: FirearmAnimations<AnimationTrack>;

	loaded = false;
	connections: Indexable<string, RBXScriptConnection> = {};

	state!: FirearmState | undefined;

	constructor() {
		super();
		this.configuration = this.getConfiguration();
	}

	onStart() {
		this.load();

		this.connections.activated = this.instance.Activated.Connect(() => {
			if (this.state?.cooldown || this.state?.magazine === undefined) return;
			this.loadedAnimations.Fire.Play();
			Events.FireFirearm.fire(this.instance, this.wielder.GetMouse().Hit.Position);
		});

		this.connections.equipped = this.instance.Equipped.Connect(() => {
			this.loadedAnimations.Idle.Play();
		});

		this.connections.unequipped = this.instance.Unequipped.Connect(() => {
			this.loadedAnimations.Idle.Stop();
		});
	}

	load() {
		this.loadAnimations();

		clientStore.subscribe(selectCombatState(this.wielder.UserId), (state) => {
			if (state && state.weapon && state.weapon.configuration.tool === this.instance) {
				this.state = state.weapon as FirearmState;
			} else {
				this.state = undefined;
			}
			this.loaded = true;
		});
	}

	private getConfiguration() {
		return require(this.instance.FindFirstChildOfClass("ModuleScript") as ModuleScript) as FirearmLike;
	}

	loadAnimations() {
		if (!this.character) return;
		this.character.WaitForChild("Humanoid");
		this.loadedAnimations = AnimationUtil.convertDictionaryToTracks(
			this.configuration.animations,
			this.character.Humanoid,
		) as FirearmAnimations<AnimationTrack>;
	}
}
