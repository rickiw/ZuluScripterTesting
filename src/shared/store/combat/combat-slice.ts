import { createProducer } from "@rbxts/reflex";
import { PlayerID } from "shared/constants/clans";
import { WeaponState } from "shared/constants/weapons";

export interface ICombatState {
	weapon?: WeaponState;
	hasWeapon: boolean;
}

export interface CombatState {
	readonly [id: number]: ICombatState | undefined;
}

const initialState: CombatState = {};

export const combatSlice = createProducer(initialState, {
	setWeapon: (state, userId: PlayerID, weapon?: WeaponState) => ({
		...state,
		[userId]: {
			weapon,
			hasWeapon: !!weapon,
		},
	}),
});
