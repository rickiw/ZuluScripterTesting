/**
 * @author </Nexus_Prime>
 * @description In case needed help to understand, go to https://nexusprime.vercel.app
 */

import { setTimeout } from "@rbxts/set-timeout";
import { Notification } from "client/ui/hooks/use-notification";
import { clientStore as store } from "../../store";

const AUTODELETE_NOTIFICATION_TIMEOUT = 4;

const NotificationsHandler = class {
	add(notification: Omit<Notification, "id">) {
		let id = 0;
		this.setter((prev) => {
			id = prev.size();
			return [...prev, { ...notification, id }];
		});

		if (notification.autodelete !== false) {
			setTimeout(() => this.remove(id), AUTODELETE_NOTIFICATION_TIMEOUT);
		}

		return id;
	}

	remove(notificationId: Notification["id"]) {
		this.setter((prev) => prev.filter((n) => n.id !== notificationId));
	}

	constructor(
		public setter: (
			arg: Notification[] | ((state: Notification[]) => Notification[]),
		) => any = store.setNotifications,
	) {}
};

export default NotificationsHandler;
