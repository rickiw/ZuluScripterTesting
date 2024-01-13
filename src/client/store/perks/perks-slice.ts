import { createProducer } from "@rbxts/reflex";
import { PerkInfo } from "shared/store/perks";

export interface PerkState {
	readonly allPerks: PerkInfo[];
	readonly selectedPerk?: PerkInfo;
}

const initialState: PerkState = {
	allPerks: [
		{
			title: "Ghoul",
			description: "Increases stamina and health by 10%",
			price: 100,
			displayImage: "rbxassetid://15355259649",
			color: Color3.fromRGB(52, 139, 255),
		},
		{
			title: "KingSlayer",
			description: "Increases stamina by 20%, health by 10%, credits by 10%",
			price: 250,
			displayImage: "rbxassetid://15355244955",
			color: Color3.fromRGB(255, 35, 39),
		},
		{
			title: "Hex",
			description: "Increases stamina by 20%, health by 20%, credits by 20%",
			price: 250,
			displayImage: "rbxassetid://15355259649",
			color: Color3.fromRGB(181, 255, 8),
		},
		{
			title: "Scourge",
			description: "Increases stamina by 10%, health by 20%, credits by 40%",
			price: 250,
			displayImage: "rbxassetid://15355244955",
			color: Color3.fromRGB(43, 0, 255),
		},
	],
	selectedPerk: undefined,
};

export const perkSlice = createProducer(initialState, {
	setSelectedPerk: (state, perk: PerkInfo) => ({
		...state,
		selectedPerk: perk,
	}),
});
