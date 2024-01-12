import { BaseComponent, Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { Logger } from "@rbxts/log";
import Maid from "@rbxts/maid";
import { Players } from "@rbxts/services";

export interface TouchpadInstance extends Tool {}
export interface TouchpadAttributes {}

@Component({ tag: "baseTouchpad" })
export class BaseTouchpad<A extends TouchpadAttributes, I extends TouchpadInstance>
	extends BaseComponent<A, I>
	implements OnStart
{
	maid = new Maid();
	wielder: Player;
	constructor() {
		super();

		this.wielder = this.getWielder();
	}

	onStart(): void {
		Logger.default().Warn(`Touchpad::onStart() impl not created`);
	}

	getWielder() {
		return this.instance.Parent?.IsA("Model")
			? (Players.GetPlayerFromCharacter(this.instance.Parent) as Player)
			: (this.instance.FindFirstAncestorOfClass("Player") as Player);
	}
}
