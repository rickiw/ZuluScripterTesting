import { Controller, OnStart } from "@flamework/core";
import { clientStore } from "client/store";
import { selectNotifications } from "client/store/notifications";

@Controller()
export class NotificationHandler implements OnStart {
	onStart() {
		clientStore.subscribe(selectNotifications, (notifications) => {
			for (const notification of notifications) {
				if (notification.ran) {
					continue;
				}

				const remove = () => {
					clientStore.clearNotification(notification.id);
				};

				clientStore.runNotification(notification.id);

				if (notification.timer) {
					task.delay(notification.timer, () => {
						remove();
					});
				}
			}
		});
	}
}
