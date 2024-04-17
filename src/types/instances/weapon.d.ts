type WeaponModificationMount = BasePart & {
	Attachment: Attachment;
	ModAttachment: Attachment;
};

type Modification = BasePart & {
	Attachment: Attachment;
};

type ATTACHMENT = "Flashlight" | "Suppressor" | "RedDot";
type WEAPON = "AK-105" | "AK-105S";
