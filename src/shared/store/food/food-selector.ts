import { SharedState } from "..";

export const selectRecipes = (state: SharedState) => state.food.recipes;
