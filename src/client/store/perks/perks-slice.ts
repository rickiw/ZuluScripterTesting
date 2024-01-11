import { createProducer } from "@rbxts/reflex";

export interface Perk {
	readonly title: string;
	readonly price: number;
	readonly description: string;
	readonly displayImage: string;
	readonly color: Color3;
}

export interface PerkState {
	readonly activePerks: Perk[];
	readonly allPerks: Perk[];
	readonly selectedPerk?: Perk;
}

const initialState: PerkState = {
	activePerks: [],
	allPerks: [
		{
			title: "TEST_PERK_1",
			description: "TEST_DESCRIPTION",
			price: 100,
			displayImage: "rbxassetid://15355259649",
			color: Color3.fromRGB(52, 139, 255),
		},
		{
			title: "TEST_PERK_2",
			description: "TEST_DESCRIPTION",
			price: 250,
			displayImage: "rbxassetid://15355244955",
			color: Color3.fromRGB(255, 35, 39),
		},
	],
	selectedPerk: undefined,
};

export const perkSlice = createProducer(initialState, {
	setSelectedPerk: (state, perk: Perk) => ({
		...state,
		selectedPerk: perk,
	}),
});
