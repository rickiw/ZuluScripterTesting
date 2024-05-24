import { OnStart, Service } from "@flamework/core";
import Log from "@rbxts/log";
import { Events } from "server/network";

@Service()
export class RagdollService implements OnStart {
	onStart() {
		Events.HelpTwo.connect((player) => {
			Log.Warn("Help2 event fired!");
		});
	}
}
