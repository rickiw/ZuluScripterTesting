import { RootState } from "client/store";

export const selectCustomization = (state: RootState) => state.customization;
export const selectCustomizationIsOpen = (state: RootState) => state.customization.isOpen;
export const selectSelectedWeapon = (state: RootState) => state.customization.selectedWeapon;
