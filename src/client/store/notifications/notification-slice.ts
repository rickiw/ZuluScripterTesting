import { createProducer } from "@rbxts/reflex";
import { notificationMiddleware } from "../middleware/notification";

export interface Notification {
	id: number;
	title: string;
	subtitle?: string;
	content: string;
	timer: number;
	startTime?: number;
	ran?: boolean;
}

export interface NotificationState {
	notifications: Notification[];
	activeNotification?: Notification;
}

const initialState: NotificationState = {
	activeNotification: undefined,
	notifications: [],
};

export const notificationSlice = createProducer(initialState, {
	pushNotification: (state, notification: Notification) => ({
		...state,
		notifications: [...state.notifications, notification],
	}),
	popNotification: (state) => {
		const notifications = [...state.notifications];
		const nextNotification = notifications.shift();
		if (nextNotification) {
			nextNotification.startTime = tick();
		}
		return {
			...state,
			notifications,
			activeNotification: nextNotification,
		};
	},
	clearActiveNotification: (state) => ({
		...state,
		activeNotification: undefined,
	}),
	clearAllNotifications: (state) => ({
		...state,
		notifications: [],
		activeNotification: undefined,
	}),
});

notificationSlice.applyMiddleware(notificationMiddleware);

export type NotificationActions = typeof notificationSlice.getActions;
