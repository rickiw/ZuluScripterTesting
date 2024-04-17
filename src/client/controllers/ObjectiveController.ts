import { Controller, OnStart } from "@flamework/core";
import Log from "@rbxts/log";
import { Workspace } from "@rbxts/services";
import { Events } from "client/network";
import { clientStore } from "client/store";

@Controller()
export class ObjectiveController implements OnStart {
	constructor() {}

	onStart() {
		Events.ToggleBeacon.connect((objectiveName, toggled) => {
			const objective = Workspace.Objectives.FindFirstChild(objectiveName) as
				| (Model & { Beacon: BasePart })
				| undefined;
			assert(objective, `objective ${objectiveName} not found`);
			objective.Beacon.Transparency = toggled ? 0.5 : 1;
			if (!toggled) {
				clientStore.stopActiveObjective();
			}
		});

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
