import { Controller, OnStart } from "@flamework/core";
import Log from "@rbxts/log";
import { UserInputService } from "@rbxts/services";
import { Functions } from "client/network";
import { HandlesMultipleInputs } from "./BaseInput";

const actions = [
	{ input: [Enum.KeyCode.O, Enum.KeyCode.ButtonA], action: "CreateClan" },
	{ input: [Enum.KeyCode.Z], action: "ViewAllClans" },
] as const;
type ClanActions = typeof actions extends ReadonlyArray<{ input: any; action: infer A }> ? A[] : never;

@Controller()
export class ClanController extends HandlesMultipleInputs<ClanActions> implements OnStart {
	inputs = actions;

	onStart() {
		UserInputService.InputEnded.Connect((input, processed) => {
			if (processed) return;
			if (this.hasInput(input.KeyCode) === "CreateClan") {
				const [success, status] = Functions.CreateClan("Test").await();
				if (!success) {
					Log.Warn("Failed to create clan: {@Status}", status);
					return;
				}
				Log.Warn("Clan created: {@Status}", status);
			} else if (this.hasInput(input.KeyCode) === "ViewAllClans") {
				const [success, clans] = Functions.GetClans().await();
				Log.Warn("Clans: {@Clans}", clans);
			}
		});
	}
}
