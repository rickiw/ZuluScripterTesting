import { createProducer } from "@rbxts/reflex";
import { GroupID } from "shared/constants/clans";
import { mapProperty } from "shared/utils";
import { PerkInfo } from "../perks";

export interface PlayerProfile {
	readonly logInTimes: number;
	readonly dailyLoginStreak: number;
	readonly lastLogin: number; // TODO: consider using a serialized DateTime string here
	readonly experience: number;
	readonly clan: GroupID | undefined;
	readonly purchasedPerks: ReadonlyArray<PerkInfo>;
	readonly scrap: Map<string, number>;
	readonly credits: number;
}

export interface SaveState {
	readonly [id: number]: PlayerProfile | undefined;
}

const initialState: SaveState = {};

// TODO: consider using a per-player producer

export const playerSaveSlice = createProducer(initialState, {
	setPlayerSave: (state, userId: number, save: PlayerProfile) => ({
		...state,
		[userId]: save,
	}),
	deletePlayerSave: (state, userId: number) => ({
		...state,
		[userId]: undefined,
	}),
	updatePlayerSave: (state, userId: number, update: Partial<PlayerProfile>) => {
		return mapProperty(state, userId, (save) => ({
			...save,
			...update,
		}));
	},
});
