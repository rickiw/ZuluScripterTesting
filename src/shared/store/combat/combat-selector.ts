import { FirearmState } from "shared/constants/weapons/state";
import { SharedState } from "..";

export const selectCombatStates = (state: SharedState) => state.combat;
export const selectCombatState = (userId: number) => (state: SharedState) => state.combat[userId];

// firearm
export const selectWeapon = (userId: number) => (state: SharedState) => state.combat[userId]?.weapon;
export const selectMag = (userId: number) => (state: SharedState) =>
	(state.combat[userId]?.weapon as FirearmState).magazine;

export const selectMagHolding =
	(userId: number) =>
	(state: SharedState): number | undefined => {
		if (
			!state.combat[userId] ||
			!state.combat[userId]?.weapon ||
			(state.combat[userId]?.weapon as FirearmState).magazine === undefined
		) {
			return undefined;
		}
		return (state.combat[userId]?.weapon as FirearmState).magazine.holding;
	};
