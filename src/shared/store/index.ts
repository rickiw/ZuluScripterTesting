import { CombineStates } from "@rbxts/reflex";
import { combatSlice } from "./combat";
import { playerSaveSlice } from "./saves";

export type SharedState = CombineStates<typeof slices>;

export const slices = {
	saves: playerSaveSlice,
	combat: combatSlice,
};
