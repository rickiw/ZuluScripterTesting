import { BaseComponent, Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import Maid from "@rbxts/maid";
import Signal from "@rbxts/signal";

export interface InteractionInstance extends ProximityPrompt {}

export interface InteractionAttributes {
	studSize: number;
	billboard: true;
}

export interface OnInteract {
	onInteract(player: Player, prompt?: ProximityPrompt): boolean;
}

@Component({
	defaults: {
		studSize: 1.5,
		billboard: false,
	},
	tag: "baseInteraction",
})
export class BaseInteraction<A extends InteractionAttributes, I extends InteractionInstance>
	extends BaseComponent<A, I>
	implements OnStart
{
	maid = new Maid();
	activated: Signal<(plr: Player) => void>;
	interactBegin: Signal<(plr: Player) => void>;
	interactEnd: Signal<(plr: Player) => void>;
	messageReceived: Signal<(plr: Player, message: string) => void>;

	constructor() {
		super();

		this.activated = new Signal();
		this.interactBegin = new Signal();
		this.interactEnd = new Signal();
		this.messageReceived = new Signal();

		this.maid.GiveTask(this.activated);
		this.maid.GiveTask(this.interactBegin);
		this.maid.GiveTask(this.interactEnd);
		this.maid.GiveTask(this.messageReceived);
	}

	setEnabled(enabled: boolean) {
		this.instance.Enabled = enabled;
	}

	onStart() {
		this.instance.Triggered.Connect((plr) => {
			this.activated.Fire(plr);
		});
		this.instance.PromptButtonHoldBegan.Connect((plr) => this.interactBegin.Fire(plr));
		this.instance.PromptButtonHoldEnded.Connect((plr) => this.interactEnd.Fire(plr));
	}

	getStudSize() {
		return this.attributes.studSize;
	}
}
