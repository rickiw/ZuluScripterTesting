import { FirearmLike } from ".";

export interface FirearmAttachment {
	modifiers: Partial<FirearmLike>;
	mountAttachment?: Attachment;
	mountsTo?: string;
	model?: Model;
}
