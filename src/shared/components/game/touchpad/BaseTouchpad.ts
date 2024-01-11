import { BaseComponent, Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import Maid from "@rbxts/maid";
import Signal from "@rbxts/signal";

export interface TouchpadInstance extends Tool {}
export interface TouchpadAttributes {}

@Component({
	tag: "roombaTouchpad",
})
export class BaseTouchpad<A extends TouchpadAttributes, I extends TouchpadInstance>
	extends BaseComponent<A, I>
	implements OnStart
{
	maid = new Maid();
	activated: Signal<() => void>;
	deactivated: Signal<() => void>;

	active: boolean;
	constructor() {
		super();

		this.active = false;

		this.activated = new Signal();
		this.deactivated = new Signal();

		this.maid.GiveTask(this.activated);
		this.maid.GiveTask(this.deactivated);
	}

	onStart(): void {
		this.instance.Activated.Connect(() => {
			this.active = !this.active;
			if (this.active) this.activated.Fire();
			else this.deactivated.Fire();
		});
	}
}
