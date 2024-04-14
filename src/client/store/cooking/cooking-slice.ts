import { createProducer } from "@rbxts/reflex";

export interface CookingState {
	isOpen: boolean;
	recipes: string[];
}

const initialState: CookingState = {
	isOpen: false,
	recipes: [],
};

export const cookingSlice = createProducer(initialState, {
	setCookingOpen: (state, isOpen: boolean) => ({ ...state, isOpen }),
	setRecipes: (state, recipes: string[]) => ({ ...state, recipes }),
});
