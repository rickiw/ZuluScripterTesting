import { createProducer } from "@rbxts/reflex";
import { PlayerID } from "shared/constants/clans";
import { WeaponState } from "shared/constants/weapons";
import { mapProperty } from "shared/utils";

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
	updateWeapon: (state, userId: number, update: Partial<WeaponState>) => {
		return mapProperty(state, userId, (state) => ({
			...state,
			...update,
		}));
	},
});
