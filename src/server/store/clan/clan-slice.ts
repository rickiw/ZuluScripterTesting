import { createProducer } from "@rbxts/reflex";
import { ClanMember } from "server/services/ClanService";
import { clanMiddleware } from "../middleware/clan";

export enum ClanRank {
	Owner = "OWNER",
	Admin = "ADMIN",
	Member = "MEMBER",
}

export interface Clan {
	title: string;
	members: ClanMember[];
	owner: Player["UserId"];
	bank: number;
}

export interface ClanState {
	clans: ReadonlyArray<Clan>;
}

const initialState: ClanState = {
	clans: [],
};

const clanSliceActions = {
	createClan: (state: ClanState, clan: Clan) => ({
		...state,
		clans: [...state.clans, clan],
	}),
	setClans: (state: ClanState, clans: Clan[]) => ({
		...state,
		clans,
	}),
};
export type ClanActions = typeof clanSliceActions;

export const clanSlice = createProducer(initialState, clanSliceActions);

clanSlice.applyMiddleware(clanMiddleware);
