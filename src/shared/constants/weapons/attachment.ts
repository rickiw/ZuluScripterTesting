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

export const ModificationType = ["Sights", "Mag", "Handguard"] as const;
export type ModificationType = (typeof ModificationType)[number];

export type IModification = { name: string; type: ModificationType; modification: Modification };

export const MuzzleBreak: IModification = {
	name: "Muzzle Break",
	modification: ReplicatedStorage.Assets.Attachments.MuzzleBreak,
	type: "Handguard",
};

export const Suppressor: IModification = {
	name: "Suppressor",
	modification: ReplicatedStorage.Assets.Attachments.Suppressor,
	type: "Handguard",
};

export const RedDot: IModification = {
	name: "Red Dot Sight",
	modification: ReplicatedStorage.Assets.Attachments.RedDot,
	type: "Sights",
};

export function getAllModifications() {
	const modifications: Map<WEAPON, Array<IModification>> = new Map();
	modifications.set("AK-105", [MuzzleBreak, Suppressor]);
	modifications.set("AK-105S", [RedDot, MuzzleBreak]);
	return modifications;
}

export function getModifications(weapon: WEAPON) {
	return getAllModifications().get(weapon);
}
