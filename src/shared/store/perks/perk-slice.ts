export type PerkType = "Ghoul" | "KingSlayer" | "Hex" | "Scourge";

export interface PerkInfo {
	readonly title: PerkType;
	readonly price: number;
	readonly description: string;
	readonly displayImage: string;
	readonly color: Color3;
}

export const PERKS: { [key in PerkType]: PerkInfo } = {
	Ghoul: {
		title: "Ghoul",
		description: "Increases stamina and health by 10%",
		price: 100,
		displayImage: "rbxassetid://15355259649",
		color: Color3.fromRGB(52, 139, 255),
	},
	KingSlayer: {
		title: "KingSlayer",
		description: "Increases stamina by 20%, health by 10%, credits by 10%",
		price: 250,
		displayImage: "rbxassetid://15355244955",
		color: Color3.fromRGB(255, 35, 39),
	},
	Hex: {
		title: "Hex",
		description: "Increases stamina by 20%, health by 20%, credits by 20%",
		price: 250,
		displayImage: "rbxassetid://15355259649",
		color: Color3.fromRGB(181, 255, 8),
	},
	Scourge: {
		title: "Scourge",
		description: "Increases stamina by 10%, health by 20%, credits by 40%",
		price: 250,
		displayImage: "rbxassetid://15355244955",
		color: Color3.fromRGB(43, 0, 255),
	},
};
