import { createProducer } from "@rbxts/reflex";

export enum OperatingSystemPages {
	Home,
	Documents,
	Audio,
	Electrical,
}

interface initialState {
	Open: boolean;
	ActivePage: OperatingSystemPages;
}

const initialState: initialState = {
	Open: false,
	ActivePage: OperatingSystemPages.Home,
};

export const operatingSystemSlice = createProducer(initialState, {
	setOperatingSystemVisibility: (state, boolean) => ({
		...state,
		Open: boolean,
	}),
	setOperatingSystemCurrentFrame: (state, page) => ({
		...state,
		ActivePage: page,
	}),
});
