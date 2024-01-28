import { FirearmLike } from "shared/types/combat/FirearmWeapon/FirearmLike";

export interface FirearmAttachment {
	modifiers: Partial<FirearmLike>;
	mountAttachment?: Attachment;
	mountsTo?: string;
	model?: Model;
}
