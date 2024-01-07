import { createProducer } from "@rbxts/reflex";
import { mapProperty } from "shared/utils";

export interface PlayerProfile {
	readonly logInTimes: number;
	readonly dailyLoginTimes: number;
	readonly lastLogin: number;
	readonly experience: number;
	readonly scrap: Map<string, number>;
	readonly credits: number;
}

export interface SaveState {
	readonly [id: number]: PlayerProfile | undefined;
}

const initialState: SaveState = {};

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
