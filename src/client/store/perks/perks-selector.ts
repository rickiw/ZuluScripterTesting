import { RootState } from "..";

export const selectPerks = (state: RootState) => {
	return state.perks.allPerks;
};

export const selectActivePerk = (state: RootState) => {
	return state.perks.selectedPerk;
};
