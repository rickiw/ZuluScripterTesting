import { createProducer } from "@rbxts/reflex";
import { mapProperty } from "shared/utils";
import { PerkInfo } from "../perks";

export interface PlayerProfile {
	readonly logInTimes: number;
	readonly dailyLoginTimes: number; // TODO: rename to dailyLoginStreak
	readonly lastLogin: number; // TODO: consider using a serialized DateTime string here
	readonly experience: number;
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
