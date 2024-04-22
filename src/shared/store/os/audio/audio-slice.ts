import { createProducer } from "@rbxts/reflex";
import { FacilityAlarmCode, FacilityAnnouncement } from "shared/constants/os";

export interface AudioState {
	activeCode?: FacilityAlarmCode;
	codes: FacilityAlarmCode[];
	activeAnnouncement?: FacilityAnnouncement;
	announcements: FacilityAnnouncement[];
}

const initialState: AudioState = {
	activeCode: undefined,
	codes: [
		FacilityAlarmCode.RED,
		FacilityAlarmCode.BLUE,
		FacilityAlarmCode.GREEN,
		FacilityAlarmCode.SUPERBLUE,
		FacilityAlarmCode.BLACK,
		FacilityAlarmCode.WHITE,
	],
	activeAnnouncement: undefined,
	announcements: [
		FacilityAnnouncement.Cafeteria,
		FacilityAnnouncement.Opsec,
		FacilityAnnouncement.Seminar,
		FacilityAnnouncement.Suspicious,
	],
};

export const audioSlice = createProducer(initialState, {
	setActiveCode: (state, activeCode?: FacilityAlarmCode) => ({ ...state, activeCode }),
	setActiveAnnouncement: (state, activeAnnouncement?: FacilityAnnouncement) => ({ ...state, activeAnnouncement }),
});
