import { Controller, OnStart } from "@flamework/core";
import Log from "@rbxts/log";
import { UserInputService } from "@rbxts/services";
import { Functions } from "client/network";
import { HandlesInput } from "./BaseInput";

@Controller()
export class ClanController extends HandlesInput implements OnStart {
	inputs = [Enum.KeyCode.O];

	onStart() {
		UserInputService.InputEnded.Connect((input, processed) => {
			if (!processed && this.hasInput(input.KeyCode)) {
				const [success, status] = Functions.CreateClan("Test").await();
				if (!success) {
					Log.Warn("Failed to create clan: {@Status}", status);
					return;
				}
				Log.Warn("Clan created: {@Status}", status);
			}
		});
	}
}
