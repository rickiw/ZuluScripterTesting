import { Controller, OnStart } from "@flamework/core";
import Log from "@rbxts/log";
import { Events } from "client/network";
import { clientStore } from "client/store";

@Controller()
export class ObjectiveController implements OnStart {
	constructor() {}

	onStart() {
		Events.SetActiveObjective.connect((objective) => {
			if (objective) {
				Log.Warn("Objective {@ObjectiveName} active", objective.name, objective);
				clientStore.setActiveObjective(objective);
			} else {
				Log.Warn("Objective is undefined");
				clientStore.stopActiveObjective();
			}
		});
	}
}
