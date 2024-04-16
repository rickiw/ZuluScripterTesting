import { RootState } from "..";

export const selectCooking = (state: RootState) => state.cooking;
export const selectCookingIsOpen = (state: RootState) => state.cooking.isOpen;
