import { ReplicatedStorage } from "@rbxts/services";

export const ModificationType = ["Barrel"] as const;
export type ModificationType = (typeof ModificationType)[number];

export type IModificationSave = Omit<IModification, "modification"> & {
	modification: string;
};

export type IModification = {
	name: string;
	type: ModificationType;
	modification: Modification;
};
const Attachments = ReplicatedStorage.Assets.Attachments;

export const Flashlight: IModification = {
	name: "Flashlight",
	modification: Attachments.Flashlight,
	type: "Barrel",
};

export const Suppressor: IModification = {
	name: "Suppressor",
	modification: Attachments.Suppressor,
	type: "Barrel",
};

// export const RedDot: IModification = {
// 	name: "Red Dot Sight",
// 	modification: Attachments.RedDot,
// 	type: "Sights",
// };

export function getAllModifications() {
	const modifications: Map<WEAPON, Array<IModification>> = new Map();
	modifications.set("AK-105", [Flashlight, Suppressor]);
	modifications.set("AK-105S", [Flashlight]);
	return modifications;
}

export function getModifications(weapon: WEAPON) {
	return getAllModifications().get(weapon);
}
