import { Controller, OnStart } from "@flamework/core";
import { Events } from "client/network";

@Controller()
export class ObjectiveController implements OnStart {
	constructor() {}

	onStart() {
		Events.ToggleBeacon.connect((beacon, toggled) => {
			beacon.Transparency = toggled ? 0 : 1;
		});
	}
}
