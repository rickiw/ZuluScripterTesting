import { createProducer } from "@rbxts/reflex";

export interface CharacterState {
	readonly staminaBoost: number;
	readonly sprinting: boolean;
}

const initialState: CharacterState = {
	staminaBoost: 1,
	sprinting: false,
};

export const characterSlice = createProducer(initialState, {
	setSprinting: (state, sprinting: boolean) => ({
		...state,
		sprinting,
	}),
	setStaminaBoost: (state, staminaBoost: number) => ({
		...state,
		staminaBoost,
	}),
});
