import { RootState } from "..";

export const selectNotifications = (state: RootState) => state.notifications.notifications;
export const selectActiveNotification = (state: RootState) => state.notifications.activeNotification;
