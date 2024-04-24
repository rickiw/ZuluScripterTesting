import { Controller, OnStart } from "@flamework/core";
import { Players } from "@rbxts/services";

const player = Players.LocalPlayer;

@Controller()
export class ItemController implements OnStart {
	onStart() {}
}
