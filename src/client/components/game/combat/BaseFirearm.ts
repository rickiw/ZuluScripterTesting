import { BaseComponent, Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { Players } from "@rbxts/services";
import { ObjectUtils } from "@rbxts/variant/out/ObjectUtils";
import { clientStore } from "client/store";
import { selectCombatState } from "shared/data/selectors/combat";
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

	loadedAnimations!: FirearmAnimations<AnimationTrack>;

	loaded: boolean = false;
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
			this.net.FireFirearm.fire(this.instance, this.wielder.GetMouse().Hit.Position);
		});

		this.connections.equipped = this.instance.Equipped.Connect(() => {
			this.loadedAnimations.Idle.Play();
		});

		this.connections.unequipped = this.instance.Unequipped.Connect(() => {
			this.loadedAnimations.Idle.Stop();
		});
	}

	getConfiguration(): FirearmLike {
		return require(this.instance.FindFirstChildOfClass("ModuleScript") as ModuleScript) as FirearmLike;
	}

	load() {
		this.loadAnimations();

		clientStore.subscribe(selectCombatState(this.wielder.UserId), (state) => {
			if (state && state.weapon && state.weapon.configuration.tool === this.instance)
				this.state = state.weapon as FirearmState;
			else this.state = undefined;
		});
		this.loaded = true;
	}

	unload() {
		for (const k of ObjectUtils.keys(this.connections)) this.connections[k].Disconnect();
		this.loaded = false;
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
