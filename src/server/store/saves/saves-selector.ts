import { RootState } from "..";

export const selectPlayerSaves = (state: RootState) => {
	return state.saves;
};

export const selectPlayerSave = (userId: number) => {
	return (state: RootState) => state.saves[userId];
};
