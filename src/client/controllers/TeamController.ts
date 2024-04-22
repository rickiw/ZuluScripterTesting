/**
 * @author </Nexus_Prime>
 * @description In case needed help to understand, go to https://nexusprime.vercel.app
 */

import { Controller, OnStart } from "@flamework/core";
import { clientStore as store } from "client/store";
import notifications from "client/store/notifications";
import { ReplicatedStorage } from "services";
import { CREDIT_AMOUNT_BY_ESCAPE } from "shared/constants/character";

@Controller()
export class TeamController implements OnStart {
	onStart() {
		const remoteEvent = ReplicatedStorage.WaitForChild("Escaped Class-D") as RemoteEvent;
		remoteEvent.OnClientEvent.Connect(() => this.onEscapedClassD());
	}

	onEscapedClassD() {
		const playerSave = store.getState().menu.playerSave;

		notifications.add({
			title: "Escaped Class-D",
			content: `Congratulations, you escaped!\n+ ${CREDIT_AMOUNT_BY_ESCAPE} credits`,
		});

		if (playerSave) {
			store.setSave({ ...playerSave, credits: CREDIT_AMOUNT_BY_ESCAPE });
		} else {
			notifications.add({
				title: "Error",
				content: "You can't receive credits!",
			});
		}
	}
}
