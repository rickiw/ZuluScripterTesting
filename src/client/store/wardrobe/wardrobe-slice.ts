import { createProducer } from "@rbxts/reflex";

export interface UniformBase {
	uniformType: string;
	uniformName: string;
}

export interface WardrobeState {
	selectedUniform?: UniformBase;
}

const initialState: WardrobeState = {
	selectedUniform: undefined,
};

export const wardrobeSlice = createProducer(initialState, {
	setSelectedUniform: (state, selectedUniform: UniformBase | undefined) => ({ ...state, selectedUniform }),
});
