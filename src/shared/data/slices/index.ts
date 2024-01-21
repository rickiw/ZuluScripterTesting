import { CombineStates } from "@rbxts/reflex";
import { clientSlice, combatSlice } from "./state";
import { playerSaveSlice } from "./state/saves";

export type SharedState = CombineStates<typeof slices>;

export const slices = {
	client: clientSlice,
	saves: playerSaveSlice,
	combat: combatSlice,
};
