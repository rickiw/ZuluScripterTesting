import { SharedState } from "shared/data";

export const selectCombatStates = (state: SharedState) => state.combat;
export const selectCombatState = (userId: number) => (state: SharedState) => state.combat[userId];
