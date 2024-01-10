import { createProducer } from "@rbxts/reflex";

export interface CharacterState {
	readonly stamina: number;
	readonly health: number;
	readonly sprinting: boolean;
}

const initialState: CharacterState = {
	stamina: 1,
	health: 100,
	sprinting: false,
};

export const characterSlice = createProducer(initialState, {
	incrementStamina: (state, staminaAmount: number) => ({
		...state,
		stamina: math.clamp(state.stamina + staminaAmount, 0, 1),
	}),
	setSprinting: (state, sprinting: boolean) => ({
		...state,
		sprinting,
	}),
	setHealth: (state, health: number) => ({
		...state,
		health,
	}),
});
