import { RootState } from "client/store";
import { IModification } from "shared/constants/weapons";

export const selectCustomizationIsOpen = (state: RootState) => state.customization.isOpen;
export const selectIsCustomizingWeapon = (state: RootState) => state.customization.isCustomizingWeapon;
export const selectSelectedWeapon = (state: RootState) => state.customization.selectedWeapon;
export const selectSelectedModificationMount = (state: RootState) => state.customization.selectedModificationMount;
export const selectModificationPreviews = (state: RootState) => state.customization.modificationPreviews;
export const selectCharacterCustomizationPage = (state: RootState) => state.customization.characterSelectedPage;
export const selectWeaponCustomizationPage = (state: RootState) => state.customization.weaponSelectedPage;
export const selectIsPreviewingModification = (modificationName: string) => (state: RootState) => {
	let isPreviewing = false;
	state.customization.modificationPreviews.forEach((modification: IModification) => {
		if (modification.name === modificationName) {
			isPreviewing = true;
		}
	});
	return isPreviewing;
};
