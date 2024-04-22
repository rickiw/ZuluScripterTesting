import { createProducer } from "@rbxts/reflex";

export interface CharacterState {
	readonly staminaBoost: number;
	readonly walkspeedMultiplier: number;
	readonly sprinting: boolean;
	readonly weaponEquipped: boolean;
}

const initialState: CharacterState = {
	staminaBoost: 1,
	walkspeedMultiplier: 1,
	sprinting: false,
	weaponEquipped: false,
};

export const characterSlice = createProducer(initialState, {
	setSprinting: (state, sprinting: boolean) => ({
		...state,
		sprinting,
	}),
	setWeaponEquipped: (state, weaponEquipped: boolean) => ({
		...state,
		weaponEquipped,
	}),
	setWalkspeedMultiplier: (state, walkspeedMultiplier: number) => ({
		...state,
		walkspeedMultiplier,
	}),
	setStaminaBoost: (state, staminaBoost: number) => ({
		...state,
		staminaBoost,
	}),
});
