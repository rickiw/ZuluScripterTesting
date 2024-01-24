import { RootState } from "..";

export const selectClanIds = (state: RootState) => {
	return state.clans.clans.map((clan) => clan.groupId);
};

export const selectClans = (state: RootState) => {
	return state.clans.clans;
};

export const selectClan = (groupId: number) => {
	return (state: RootState) => {
		return state.clans.clans.find((clan) => clan.groupId === groupId);
	};
};
