import { Components } from "@flamework/components";
import { Controller, OnStart } from "@flamework/core";
import { Events } from "client/network";
import { clientStore } from "client/store";

@Controller()
export class CookingController implements OnStart {
	constructor(private components: Components) {}

	onStart() {
		Events.ToggleCookMenu.connect(() => {
			clientStore.toggleCookingOpen();
		});
	}
}
