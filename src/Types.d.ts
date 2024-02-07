import { PlayerCharacterR15, RoombaCharacter } from "./CharacterTypes";

interface Workspace extends Instance {
	Doors: Folder & { [key in DoorType]: BaseDoor };
	SCPs: Folder & { [key: string]: BaseSCP };
}

type BaseDoor = Model & {
	Keypads: Model;
};

type DoorType = "SingleDoor" | "SingleGlassDoor";

type BaseSCP = Model & {};

interface ReplicatedStorage extends Instance {
	Shared: Folder & {
		systems: Folder;
	};
	Client: Folder & {
		systems: Folder;
	};
	Assets: Folder & {
		SCPs: Folder & {
			[key: string]: Model;
		};
		Roomba: RoombaCharacter;
	};
}

export interface RBXPlayer extends Player {
	Backpack: Backpack;
	Character: PlayerCharacterR15;
}

interface SoundService extends Instance {
	Effects: SoundGroup;
}

export * from "./CharacterTypes";

declare namespace JSX {
	interface IntrinsicElements {
		blureffect: JSX.IntrinsicElement<BlurEffect>;
	}
}
