import { FirearmLike } from "shared/types/combat/FirearmWeapon/FirearmLike";

export interface FirearmAttachment {
	modifiers: FirearmLike;
	mountAttachment?: Attachment;
	mountsTo?: string;
}
