import { createProducer } from "@rbxts/reflex";
import { IS_DEV } from "shared/constants/core";

export interface CharacterState {
	readonly stamina: number;
	readonly health: number;
	readonly sprinting: boolean;
}

const initialState: CharacterState = {
	stamina: IS_DEV ? math.huge : 1,
	health: 100,
	sprinting: false,
};

export const characterSlice = createProducer(initialState, {
	incrementStamina: (state, staminaAmount: number) => ({
		...state,
		stamina: math.clamp(state.stamina + staminaAmount, 0, IS_DEV ? math.huge : 1),
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
