interface Workspace extends Instance {
	Doors: Folder & { [key in DoorType]: BaseDoor };
}

type BaseDoor = Model & {
	Keypads: Model;
};

type DoorType = "SingleDoor" | "SingleGlassDoor";

interface ReplicatedStorage extends Instance {
	Shared: Folder & {
		systems: Folder;
	};
	Client: Folder & {
		systems: Folder;
	};
}

interface SoundService extends Instance {}

type BaseCharacter = Model & {
	Humanoid: Humanoid;
	Body: MeshPart;
	HumanoidRootPart: BasePart;
};

declare namespace JSX {
	interface IntrinsicElements {
		blureffect: JSX.IntrinsicElement<BlurEffect>;
	}
}
