import { RootState } from "client/store";
import { IModification } from "shared/constants/weapons";

export const selectCustomization = (state: RootState) => state.customization;
export const selectCustomizationIsOpen = (state: RootState) => state.customization.isOpen;
export const selectIsCustomizingWeapon = (state: RootState) => state.customization.isCustomizingWeapon;
export const selectSelectedWeapon = (state: RootState) => state.customization.selectedWeapon;
export const selectSelectedModification = (state: RootState) => state.customization.selectedModification;
export const selectModificationPreviews = (state: RootState) => state.customization.modificationPreviews;
export const selectIsPreviewingModification = (modificationName: string) => (state: RootState) => {
	let isPreviewing = false;
	state.customization.modificationPreviews.forEach((modification: IModification) => {
		if (modification.name === modificationName) {
			isPreviewing = true;
		}
	});
	return isPreviewing;
};
