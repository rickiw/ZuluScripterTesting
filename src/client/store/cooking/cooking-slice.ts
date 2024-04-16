import { createProducer } from "@rbxts/reflex";

export interface CookingState {
	isOpen: boolean;
}

const initialState: CookingState = {
	isOpen: false,
};

export const cookingSlice = createProducer(initialState, {
	setCookingOpen: (state, isOpen: boolean) => ({ ...state, isOpen }),
	toggleCookingOpen: (state) => ({ ...state, isOpen: !state.isOpen }),
});
