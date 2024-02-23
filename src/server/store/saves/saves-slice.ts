import { createProducer } from "@rbxts/reflex";
import { PlayerProfile, mapProperty } from "shared/utils";

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
