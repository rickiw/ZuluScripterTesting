interface Workspace extends Instance {
	Doors: Folder & { [key in DoorType]: BaseDoor };
	SCPs: Folder & { [key: string]: BaseSCP };
	Bullets: Folder;
}

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
	};
}

interface SoundService extends Instance {
	Effects: SoundGroup;
}

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
