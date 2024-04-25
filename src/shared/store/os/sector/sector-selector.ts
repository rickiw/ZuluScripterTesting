import { SectorStatus } from "shared/constants/os";
import { SharedState } from "../..";

export const selectSectors = (state: SharedState) => {
	const keys = [];
	for (const [key] of pairs(state.os.sector)) {
		keys.push(key);
	}
	return keys;
};
export const selectSectorStatuses = (state: SharedState) => {
	const statuses: [string, SectorStatus][] = [];
	for (const [key, value] of pairs(state.os.sector)) {
		statuses.push([`${key}`, value]);
	}
	statuses.sort((a, b) => a[0] < b[0]);
	return statuses;
};
export const selectSectorStatus = (sector: string) => (state: SharedState) => state.os.sector[sector];
