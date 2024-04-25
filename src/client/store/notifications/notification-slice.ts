import { createProducer } from "@rbxts/reflex";
import { notificationMiddleware } from "../middleware/notification";

export interface Notification {
	id: number;
	title: string;
	content: string;
	timer: number;
	ran?: boolean;
}

export interface NotificationState {
	notifications: Notification[];
}

const initialState: NotificationState = {
	notifications: [],
};

export const notificationSlice = createProducer(initialState, {
	pushNotification: (state, notification: Notification) => ({
		...state,
		notifications: [...state.notifications, notification],
	}),
	runNotification: (state, id: number) => ({
		...state,
		notifications: state.notifications.map((n) => {
			if (n.id === id) {
				n.ran = true;
			}
			return n;
		}),
	}),
	clearNotification: (state, id: number) => ({
		...state,
		notifications: state.notifications.filter((n) => n.id !== id),
	}),
	clearAllNotifications: (state) => ({
		...state,
		notifications: [],
	}),
});

notificationSlice.applyMiddleware(notificationMiddleware);

export type NotificationActions = typeof notificationSlice.getActions;
