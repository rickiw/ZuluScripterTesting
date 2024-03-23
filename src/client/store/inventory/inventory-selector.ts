import { RootState } from "..";

export const selectInventoryOpen = (state: RootState) => state.inventory.inventoryOpen;
export const selectHasKilledEnemy = (state: RootState) => state.inventory.hasKilledEnemy;
export const selectInventoryItems = (state: RootState) => state.inventory.inventoryItems;
export const selectIsHoldingItem = (weapon: Tool) => (state: RootState) => {
	return state.inventory.inventoryItems.some((item) => item === weapon);
};
export const selectIsHoldingItemByName = (weaponName: string) => (state: RootState) => {
	return state.inventory.inventoryItems.some((item) => item.Name === weaponName);
};
export const selectWeapons = (state: RootState) => state.inventory.allWeapons;
