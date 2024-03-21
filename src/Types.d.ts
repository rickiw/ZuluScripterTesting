interface Workspace extends Instance {
	Doors: Folder & { [key in DoorType]: BaseDoor };
	SCPs: Folder & { [key: string]: BaseSCP };
	Objectives: Folder & { [key: string]: Model };
	Bullets: Folder;
	CustomizationBox: Model & {
		Mount: BasePart;
		Weapons: Folder;
	};
}

type FoodTypes = "Chicken";

type BaseDoor = Model & {
	Keypads: Model;
};

type DoorType = "SingleDoor" | "SingleGlassDoor";

type BaseSCP = Model & {};
type BaseHumanoidSCP = BaseSCP & {
	Humanoid: Humanoid;
};

interface ReplicatedStorage extends Instance {
	Shared: Folder & {
		systems: Folder;
	};
	Client: Folder & {
		systems: Folder;
	};
	Assets: Folder & {
		Bullet: BasePart;
		Attachments: Folder & {
			[key in ATTACHMENT]: Modification;
		};
		Weapons: Folder & {
			[key in WEAPON]: Tool;
		};
	};
}

interface SoundService extends Instance {
	Effects: SoundGroup;
}

type Modification = BasePart & {
	Attachment: Attachment;
};

type ATTACHMENT = "MuzzleBreak" | "Suppressor" | "RedDot";
type WEAPON = "AK-105" | "AK-105S";

type BaseCharacter = Model & {
	Humanoid: Humanoid;
	HumanoidRootPart: BasePart;
};

type RoombaCharacter = BaseCharacter & {
	HumanoidRootPart: BasePart & {
		Dust: ParticleEmitter;
	};
};

type RBXPlayer = Player & {
	Backpack: Backpack;
	Character: import("@rbxts/promise-character").CharacterRigR15;
};

type ToolWithHandle = Tool & {
	Handle: BasePart;
};

declare namespace JSX {
	interface IntrinsicElements {
		blureffect: JSX.IntrinsicElement<BlurEffect>;
	}
}

type Prettify<T> = { [k in keyof T]: T[k] };
