import { RootState } from "..";

export const selectLoadedWeapon = (state: RootState) => state.weapon.loadedWeapon;
