import { SharedState } from "../..";

export const selectPowerState = (state: SharedState) => state.os.power;
export const selectPowerStatus = (state: SharedState) => state.os.power.powerEnabled;
export const selectTeslaGates = (state: SharedState) => {
	const keys = [];
	for (const [key] of pairs(state.os.power.teslaGates)) {
		keys.push(key);
	}
	return keys;
};
export const selectTeslaGateStatuses = (state: SharedState) => {
	const statuses: [string, boolean][] = [];
	for (const [key, value] of pairs(state.os.power.teslaGates)) {
		statuses.push([`${key}`, value]);
	}
	return statuses;
};
export const selectTeslaGateStatus = (gate: string) => (state: SharedState) => state.os.power.teslaGates[gate];
export const selectBlastDoors = (state: SharedState) => {
	const keys = [];
	for (const [key] of pairs(state.os.power.blastDoors)) {
		keys.push(key);
	}
	return keys;
};
export const selectBlastDoorStatus = (door: string) => (state: SharedState) => state.os.power.blastDoors[door];
export const selectBlastDoorStatuses = (state: SharedState) => {
	const statuses: [string, boolean][] = [];
	for (const [key, value] of pairs(state.os.power.blastDoors)) {
		statuses.push([`${key}`, value]);
	}
	return statuses;
};
