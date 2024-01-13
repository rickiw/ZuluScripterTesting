export type PerkType = "Ghoul" | "KingSlayer" | "Hex" | "Scourge";

export interface PerkInfo {
	readonly title: PerkType;
	readonly price: number;
	readonly description: string;
	readonly displayImage: string;
	readonly color: Color3;
}
