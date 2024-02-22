import { Controller, OnStart } from "@flamework/core";
import { Workspace } from "@rbxts/services";
import { Events } from "client/network";

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
		});
	}
}
