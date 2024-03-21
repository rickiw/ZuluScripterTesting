import { createProducer } from "@rbxts/reflex";
import { WeaponBase } from "shared/constants/weapons";

export interface CustomizationState {
	isOpen: boolean;
	isCustomizingWeapon: boolean;
	selectedWeapon: WeaponBase | undefined;
	selectedModification: Modification | undefined;
}

const initialState: CustomizationState = {
	isOpen: false,
	isCustomizingWeapon: false,
	selectedWeapon: undefined,
	selectedModification: undefined,
};

export const customizationSlice = createProducer(initialState, {
	setCustomizationOpen: (state, isOpen: boolean) => ({ ...state, isOpen }),
	setCustomizingWeapon: (state, isCustomizingWeapon: boolean) => ({ ...state, isCustomizingWeapon }),
	setSelectedWeapon: (state, selectedWeapon: WeaponBase | undefined) => ({ ...state, selectedWeapon }),
	setSelectedModification: (state, selectedModification: Modification | undefined) => ({
		...state,
		selectedModification,
	}),
});
