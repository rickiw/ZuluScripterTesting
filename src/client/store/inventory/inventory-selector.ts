import { RootState } from "..";

export const selectInventoryOpen = (state: RootState) => state.inventory.inventoryOpen;
export const selectActiveWeapon = (state: RootState) => state.inventory.activeWeapon;
export const selectWeapons = (state: RootState) => state.inventory.allWeapons;
