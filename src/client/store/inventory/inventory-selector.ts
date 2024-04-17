import { RootState } from "..";

export const selectInventoryOpen = (state: RootState) => state.inventory.inventoryOpen;
export const selectHasKilledEnemy = (state: RootState) => state.inventory.hasKilledEnemy;
export const selectInventoryItems = (state: RootState) => state.inventory.inventoryItems;
export const selectPrimaryWeapon = (state: RootState) => state.inventory.primaryWeapon;
export const selectSecondaryWeapon = (state: RootState) => state.inventory.secondaryWeapon;
export const selectEquippedWeaponInfo = (state: RootState) => state.inventory.equippedWeaponInfo;
export const selectIsHoldingItem = (weapon: Tool) => (state: RootState) => {
	return state.inventory.inventoryItems.some((item) => item.tool === weapon);
};
export const selectIsHoldingItemByName = (weaponName: string) => (state: RootState) => {
	return state.inventory.inventoryItems.some((item) => item.tool.Name === weaponName);
};
export const selectWeapons = (state: RootState) => state.inventory.allWeapons;
