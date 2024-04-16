import { createProducer } from "@rbxts/reflex";

export interface CookingState {
	recipes: string[];
}

const initialState: CookingState = {
	recipes: ["Hamburger", "Pizza", "Soup", "Hot Dog"],
};

export const foodSlice = createProducer(initialState, {
	setRecipes: (state, recipes: string[]) => ({ ...state, recipes }),
});
