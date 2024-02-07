import { createProducer } from "@rbxts/reflex";

export interface CustomizationState {
	isOpen: boolean;
}

const initialState: CustomizationState = {
	isOpen: false,
};

export const customizationSlice = createProducer(initialState, {
	setCustomizationOpen: (state, isOpen: boolean) => ({ ...state, isOpen }),
});
