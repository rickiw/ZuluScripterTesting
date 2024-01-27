import { FirearmLike } from ".";

export interface FirearmAttachment {
	modifiers: FirearmLike;
	mountAttachment?: Attachment;
	mountsTo?: string;
}
