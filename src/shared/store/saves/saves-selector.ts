import { SharedState } from "..";

export const selectPlayerSaves = (state: SharedState) => {
	return state.saves;
};

export const selectPlayerSave = (userId: number) => {
	return (state: SharedState) => state.saves[userId];
};
