import { RootState } from "client/store";
import { IModification } from "shared/constants/weapons";

export const selectCustomizationIsOpen = (state: RootState) => {
	return state.customization.isOpen;
};

export const selectCustomizationPage = (state: RootState) => {
	return state.customization.customizationPage;
};

export const selectSelectedWeapon = (state: RootState) => {
	return state.customization.weapon.selectedWeapon;
};

export const selectSelectedModificationMount = (state: RootState) => {
	return state.customization.weapon.selectedModificationMount;
};

export const selectModificationPreviews = (state: RootState) => {
	return state.customization.weapon.modificationPreviews;
};

export const selectCharacterCustomizationPage = (state: RootState) => {
	return state.customization.characterSelectedPage;
};

export const selectWeaponCustomizationPage = (state: RootState) => {
	return state.customization.weaponSelectedPage;
};

export const selectWeaponCustomizationPageSubtitle = (state: RootState) => {
	return state.customization.weaponPageSubtitles[state.customization.weaponSelectedPage];
};

export const selectCharacterCustomizationPageSubtitle = (state: RootState) => {
	return state.customization.characterPageSubtitles[state.customization.characterSelectedPage];
};

export const selectWeaponCustomizationPageIndex = (state: RootState) => {
	return state.customization.weaponPages.indexOf(state.customization.weaponSelectedPage) + 1;
};

export const selectCharacterCustomizationPageIndex = (state: RootState) => {
	return state.customization.characterPages.indexOf(state.customization.characterSelectedPage) + 1;
};

export const selectCharacterOptions = (state: RootState) => {
	return state.customization.character;
};

export const selectCharacterFace = (state: RootState) => {
	return state.customization.character.face;
};

export const selectCharacterHair = (state: RootState) => {
	return state.customization.character.hair;
};

export const selectCharacterOutfit = (state: RootState) => {
	return state.customization.character.outfit;
};

export const selectCharacterSkinColor = (state: RootState) => {
	return state.customization.character.skinColor;
};

export const selectIsPreviewingModification = (modificationName: string) => (state: RootState) => {
	let isPreviewing = false;
	state.customization.weapon.modificationPreviews.forEach((modification: IModification) => {
		if (modification.name === modificationName) {
			isPreviewing = true;
		}
	});
	return isPreviewing;
};
