import { createProducer } from "@rbxts/reflex";
import { clanMiddleware } from "../middleware/clan";

export enum ClanRank {
	"Owner" = 2,
	"Admin" = 1,
	"Member" = 0,
}

export interface Clan {
	title: string;
	members: Map<Player["UserId"], ClanRank>;
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
};
export type ClanActions = typeof clanSliceActions;

export const clanSlice = createProducer(initialState, clanSliceActions);

clanSlice.applyMiddleware(clanMiddleware);
