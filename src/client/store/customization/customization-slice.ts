import { createProducer } from "@rbxts/reflex";
import { IModification, WeaponBase } from "shared/constants/weapons";

export interface CustomizationState {
	isOpen: boolean;
	isCustomizingWeapon: boolean;
	selectedWeapon: WeaponBase | undefined;
	selectedModification: BasePart | undefined;
	modificationPreviews: IModification[];
}

const initialState: CustomizationState = {
	isOpen: false,
	isCustomizingWeapon: false,
	selectedWeapon: undefined,
	selectedModification: undefined,
	modificationPreviews: [],
};

export const customizationSlice = createProducer(initialState, {
	setCustomizationOpen: (state, isOpen: boolean) => ({ ...state, isOpen }),
	setCustomizingWeapon: (state, isCustomizingWeapon: boolean) => ({ ...state, isCustomizingWeapon }),
	setSelectedWeapon: (state, selectedWeapon: WeaponBase | undefined) => ({ ...state, selectedWeapon }),
	setSelectedModification: (state, selectedModification: BasePart | undefined) => ({
		...state,
		selectedModification,
	}),
	addModificationPreview: (state, modification: IModification) => ({
		...state,
		modificationPreviews: [...state.modificationPreviews, modification],
	}),
	removeModificationPreview: (state, modification: IModification) => ({
		...state,
		modificationPreviews: state.modificationPreviews.filter((preview) => preview.name !== modification.name),
	}),
	toggleModificationPreview: (state, modification: IModification) => {
		const hasPreview = state.modificationPreviews.some((preview) => preview.name === modification.name);
		return {
			...state,
			modificationPreviews: hasPreview
				? state.modificationPreviews.filter((preview) => preview.name !== modification.name)
				: [...state.modificationPreviews, modification],
		};
	},
	clearModificationPreviews: (state) => ({
		...state,
		modificationPreviews: [],
	}),
});
