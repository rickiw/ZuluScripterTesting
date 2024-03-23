import { RootState } from "..";

export const selectInventoryOpen = (state: RootState) => state.inventory.inventoryOpen;
export const selectInventoryItems = (state: RootState) => state.inventory.inventoryItems;
export const selectIsHoldingItem = (weapon: Tool) => (state: RootState) => {
	return state.inventory.inventoryItems.some((item) => item === weapon);
};
export const selectActiveWeapon = (state: RootState) => state.inventory.activeWeapon;
export const selectWeapons = (state: RootState) => state.inventory.allWeapons;
