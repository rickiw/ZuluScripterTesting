import { BaseComponent, Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import Maid from "@rbxts/maid";
import Signal from "@rbxts/signal";
import { Zone } from "@rbxts/zone-plus";

export interface PresenceInstanceModel extends Model {}

export interface PresenceInstanceBasePart extends BasePart {}

export interface PresenceAttributes {}

@Component({
	defaults: {},
	tag: "basePresence",
})
export class BasePresence<A extends PresenceAttributes, I extends PresenceInstanceBasePart>
	extends BaseComponent<A, I>
	implements OnStart
{
	maid = new Maid();
	presenceBegin: Signal<(plr: Player) => void>;
	presenceEnd: Signal<(plr: Player) => void>;
	zone: Zone;

	constructor() {
		super();

		this.presenceBegin = new Signal();
		this.presenceEnd = new Signal();

		this.maid.GiveTask(this.presenceBegin);
		this.maid.GiveTask(this.presenceEnd);

		this.zone = new Zone(this.instance);
	}

	onStart() {
		this.zone.playerEntered.Connect((plr) => this.presenceBegin.Fire(plr));
		this.zone.playerExited.Connect((plr) => this.presenceEnd.Fire(plr));
	}
}
