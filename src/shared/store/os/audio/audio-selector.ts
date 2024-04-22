import { SharedState } from "../..";

export const selectActiveAlarmCode = (state: SharedState) => state.os.audio.activeCode;
export const selectAlarmCodes = (state: SharedState) => state.os.audio.codes;
export const selectActiveAnnouncement = (state: SharedState) => state.os.audio.activeAnnouncement;
export const selectAnnouncements = (state: SharedState) => state.os.audio.announcements;
