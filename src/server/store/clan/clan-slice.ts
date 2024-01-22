import { createProducer } from "@rbxts/reflex";
import { Clan } from "shared/constants/clans";
import { clanMiddleware } from "../middleware/clan";

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
