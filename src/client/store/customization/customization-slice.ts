import { createProducer } from "@rbxts/reflex";

export interface CustomizationState {
	isOpen: boolean;
	selectedWeapon: string;
}

const initialState: CustomizationState = {
	isOpen: false,
	selectedWeapon: "",
};

export const customizationSlice = createProducer(initialState, {
	setCustomizationOpen: (state, isOpen: boolean) => ({ ...state, isOpen }),
	setSelectedWeapon: (state, selectedWeapon: string) => ({ ...state, selectedWeapon }),
});
