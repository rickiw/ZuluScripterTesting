import { createProducer } from "@rbxts/reflex";
import { IS_DEV } from "shared/constants/core";

type VitalInfo = {
	readonly value: number;
	readonly max: number;
};

export interface VitalsState {
	hunger: VitalInfo;
	thirst: VitalInfo;
	health: VitalInfo;
	stamina: VitalInfo;
}

const initialState: VitalsState = {
	hunger: {
		value: 100,
		max: 100,
	},
	thirst: {
		value: 100,
		max: 100,
	},
	health: {
		value: 100,
		max: 100,
	},
	stamina: {
		value: 100,
		max: 100,
	},
};

export const vitalsSlice = createProducer(initialState, {
	setHunger: (state, value: number) => ({
		...state,
		hunger: {
			...state.hunger,
			value,
		},
	}),
	incrementHunger: (state, hungerAmount: number) => ({
		...state,
		hunger: {
			...state.hunger,
			value: math.clamp(state.hunger.value + hungerAmount, 0, state.hunger.max),
		},
	}),
	setThirst: (state, value: number) => ({
		...state,
		thirst: {
			...state.thirst,
			value,
		},
	}),
	incrementThirst: (state, thirstAmount: number) => ({
		...state,
		thirst: {
			...state.thirst,
			value: math.clamp(state.thirst.value + thirstAmount, 0, state.thirst.max),
		},
	}),
	setHealth: (state, value: number) => ({
		...state,
		health: {
			...state.health,
			value,
		},
	}),
	setStamina: (state, value: number) => ({
		...state,
		stamina: {
			...state.stamina,
			value,
		},
	}),
	setMaxStamina: (state, max: number) => ({
		...state,
		stamina: {
			...state.stamina,
			max,
		},
	}),
	incrementStamina: (state, staminaAmount: number) => ({
		...state,
		stamina: {
			...state.stamina,
			value: math.clamp(state.stamina.value + staminaAmount, 0, IS_DEV ? math.huge : state.stamina.max),
		},
	}),
});
