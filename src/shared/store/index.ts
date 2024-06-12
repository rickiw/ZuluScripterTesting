import { CombineStates } from "@rbxts/reflex";
import { combatSlice } from "./combat";
import { foodSlice } from "./food";
import { objectivesSlice } from "./objectives";
import { osSlice } from "./os";
import { playersSlice } from "./players";
import { teamSlice } from "./teams";

export type SharedState = CombineStates<typeof slices>;

export const slices = {
	combat: combatSlice,
	objectives: objectivesSlice,
	team: teamSlice,
	food: foodSlice,
	os: osSlice,
	players: playersSlice,
};
