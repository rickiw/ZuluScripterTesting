import { createProducer } from "@rbxts/reflex";
import { IModification, WeaponBase } from "shared/constants/weapons";

export interface CustomizationState {
	isOpen: boolean;
	isCustomizingWeapon: boolean;
	selectedWeapon: WeaponBase | undefined;
	selectedModificationMount: BasePart | undefined;
	modificationPreviews: IModification[];
	characterSelectedPage: "character" | "teams" | "uniform" | "other";
	weaponSelectedPage: "primary" | "secondary" | "melee" | "attachments";
}

const initialState: CustomizationState = {
	isOpen: false,
	isCustomizingWeapon: true,
	selectedWeapon: undefined,
	selectedModificationMount: undefined,
	modificationPreviews: [],
	characterSelectedPage: "teams",
	weaponSelectedPage: "primary",
};

export const customizationSlice = createProducer(initialState, {
	setCustomizationOpen: (state, isOpen: boolean) => ({ ...state, isOpen }),
	setCustomizingWeapon: (state, isCustomizingWeapon: boolean) => ({ ...state, isCustomizingWeapon }),
	setSelectedWeapon: (state, selectedWeapon: WeaponBase | undefined) => ({
		...state,
		selectedWeapon,
	}),
	setCharacterCustomizationPage: (state, characterSelectedPage: CustomizationState["characterSelectedPage"]) => ({
		...state,
		characterSelectedPage,
	}),
	setWeaponCustomizationPage: (state, weaponSelectedPage: CustomizationState["weaponSelectedPage"]) => ({
		...state,
		weaponSelectedPage,
	}),
	setSelectedModificationMount: (state, selectedModificationMount: BasePart | undefined) => ({
		...state,
		selectedModificationMount,
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
	resetPreview: (state) => ({
		...state,
		selectedModificationMount: undefined,
		modificationPreviews: [],
	}),
});
