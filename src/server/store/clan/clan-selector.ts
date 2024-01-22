import { RootState } from "..";

export const selectClans = (state: RootState) => {
	return state.clans.clans;
};
