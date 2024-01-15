import { createProducer } from "@rbxts/reflex";

export interface CombatState {}
const initialState: CombatState = {};

export const combatSlice = createProducer(initialState, {});
