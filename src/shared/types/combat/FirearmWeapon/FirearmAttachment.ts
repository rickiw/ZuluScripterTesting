import { FirearmLike } from "shared/types/combat/FirearmWeapon/FirearmLike";

type ModifierOfFirearmLike<T extends keyof FirearmLike> = Partial<FirearmLike[T]>;

export interface FirearmAttachment<T extends keyof FirearmLike> {
	type: T;
	modifiers: ModifierOfFirearmLike<T>;
	mountAttachment?: Attachment;
	mountsTo?: string;
	model?: Model;
}
