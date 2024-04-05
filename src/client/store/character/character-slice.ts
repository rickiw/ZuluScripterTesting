import { createProducer } from "@rbxts/reflex";

export interface CharacterState {
	readonly staminaBoost: number;
	readonly walkspeedMultiplier: number;
	readonly sprinting: boolean;
}

const initialState: CharacterState = {
	staminaBoost: 1,
	walkspeedMultiplier: 1,
	sprinting: false,
};

export const characterSlice = createProducer(initialState, {
	setSprinting: (state, sprinting: boolean) => ({
		...state,
		sprinting,
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
