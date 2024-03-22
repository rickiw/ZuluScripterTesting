import { ReplicatedStorage } from "@rbxts/services";
import { FirearmLike } from ".";

type ModifierOfFirearmLike<T extends keyof FirearmLike> = Partial<FirearmLike[T]>;

export interface FirearmAttachment<T extends keyof FirearmLike> {
	type: T;
	modifiers: ModifierOfFirearmLike<T>;
	mountAttachment?: Attachment;
	mountsTo?: string;
	model?: Model;
}

export const ModificationType = ["Barrel"] as const;
export type ModificationType = (typeof ModificationType)[number];

export type IModification = { name: string; type: ModificationType; modification: Modification };
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
