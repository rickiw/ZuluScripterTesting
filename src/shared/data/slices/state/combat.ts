import { createProducer } from "@rbxts/reflex";
import { WeaponState } from "shared/types/combat/Weapon";

export interface CombatState {
	weapon?: WeaponState;
	hasWeapon: boolean;
}

export interface CombatStates {
	readonly [id: number]: CombatState | undefined;
}

const initialState: CombatStates = {};

export const combatSlice = createProducer(initialState, {
	setWeapon: (state: CombatStates, userId: number, weapon?: WeaponState) => ({
		...state,
		[userId]: {
			weapon,
			hasWeapon: !!weapon,
		},
	}),
});
