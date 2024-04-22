/**
 * @author </Nexus_Prime>
 * @description In case needed help to understand, go to https://nexusprime.vercel.app
 */

import { useProducer, useSelector } from "@rbxts/react-reflex";
import { RootState } from "client/store";
import { notificationSlice } from "client/store/notifications/notification-slice";
import NotificationsHandler from "client/store/notifications/notification-util";

export interface Notification {
	id: number;
	title: string;
	content: string;
	/** Default is true */
	autodelete?: boolean;
}

export function useNotification() {
	const notifications = useSelector((s: RootState) => s.notification);
	const { setNotifications } = useProducer<typeof notificationSlice>();

	const { add: addNotification, remove: removeNotification } = new NotificationsHandler(setNotifications);

	return {
		notifications,
		addNotification,
		removeNotification,
	};
}
