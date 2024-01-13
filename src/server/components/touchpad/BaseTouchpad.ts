import { BaseComponent, Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import Log from "@rbxts/log";
import Maid from "@rbxts/maid";
import { Players } from "@rbxts/services";
import { PlayerCharacterR15, RoombaCharacter } from "../../../CharacterTypes";

export interface TouchpadInstance extends Tool {}
export interface TouchpadAttributes {}

@Component({ tag: "baseTouchpad" })
export class BaseTouchpad<A extends TouchpadAttributes, I extends TouchpadInstance>
	extends BaseComponent<A, I>
	implements OnStart
{
	maid = new Maid();
	wielder!: Player & {
		Character: PlayerCharacterR15 | RoombaCharacter;
	};

	constructor() {
		super();

		this.wielder = this.getWielder();
	}

	onStart(): void {
		Log.Error("Not implemented");
	}

	getWielder() {
		return this.instance.Parent?.IsA("Model")
			? (Players.GetPlayerFromCharacter(this.instance.Parent) as Player & {
					Character: PlayerCharacterR15;
				})
			: (this.instance.FindFirstAncestorOfClass("Player") as Player & {
					Character: PlayerCharacterR15;
				});
	}
}
