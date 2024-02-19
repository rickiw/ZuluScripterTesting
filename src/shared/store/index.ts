import { CombineStates } from "@rbxts/reflex";
import { combatSlice } from "./combat";
import { objectivesSlice } from "./objectives";
import { playerSaveSlice } from "./saves";

export type SharedState = CombineStates<typeof slices>;

export const slices = {
	combat: combatSlice,
	objectives: objectivesSlice,
	saves: playerSaveSlice,
};
