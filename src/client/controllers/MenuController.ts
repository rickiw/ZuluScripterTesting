import { Controller, OnStart } from "@flamework/core";

@Controller()
export class MenuController implements OnStart {
	constructor() {
		const mountPosition = new Vector3(-4.5, 11.5, 89.5);
		const mountOrientation = new Vector3(-9.994, 172.969, 0.353);

		const panelPosition = new Vector3(-8.5, 10, 97.5);
		const panelOrientation = new Vector3(0, -15, 0);

		const panelPositionDiff = panelPosition.sub(mountPosition);
		const panelOrientationDiff = panelOrientation.sub(mountOrientation);
	}

	onStart() {}
}
