import { RootState } from "..";

export const selectHunger = (state: RootState) => state.vitals.hunger;

export const selectThirst = (state: RootState) => state.vitals.thirst;

export const selectHealth = (state: RootState) => state.vitals.health;

export const selectStamina = (state: RootState) => state.vitals.stamina;
