import { RootState } from "..";

export const selectNotifications = (state: RootState) => state.notifications.notifications;
export const selectActiveNotifications = (state: RootState) => state.notifications.notifications.filter((n) => !n.ran);
