import { createProducer } from "@rbxts/reflex";

export type TouchpadType = "RemoteController" | "Menu" | "None";

export interface TouchpadState {
	touchpadType: TouchpadType;
	active: boolean;
}

const initialState: TouchpadState = {
	touchpadType: "None",
	active: false,
};

export const touchpadSlice = createProducer(initialState, {
	setType: (state, touchpadType) => ({
		...state,
		touchpadType,
	}),
	setActive: (state, active) => ({
		...state,
		active,
	}),
});
