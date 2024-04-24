import { Controller, OnStart } from "@flamework/core";
import { Events } from "client/network";
import { clientStore } from "client/store";
import { CREDIT_AMOUNT_BY_ESCAPE } from "shared/constants/character";

@Controller()
export class TeamController implements OnStart {
	onStart() {
		Events.ClassDEscape.connect(() => this.onEscapedClassD());
	}

	onEscapedClassD() {
		clientStore.pushNotification({
			id: math.random(1, 9999),
			title: "Escaped Class-D",
			content: `Congratulations, you escaped!\n+ ${CREDIT_AMOUNT_BY_ESCAPE} credits`,
			timer: 5,
		});
	}
}
