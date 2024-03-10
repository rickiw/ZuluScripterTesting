import { Controller, OnStart } from "@flamework/core";
import { Players } from "@rbxts/services";

const Player = Players.LocalPlayer;

@Controller()
export class DebugController implements OnStart {
	constructor() {}

	onStart() {
		// const target = Player.FindFirstChildOfClass("PlayerGui");
		// const iris = Iris.Init(target);
		// iris.Connect(() => {
		// 	Iris.Window(["Debug"]);
		// });
		// iris.End();
	}
}
