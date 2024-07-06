interface Workspace extends Instance {
	Doors: Folder & { [key in DoorType]: BaseDoor };
	SCPs: Folder & { [key: string]: BaseSCP };
	Objectives: Folder & { [key: string]: Model };
	Bullets: Folder;
	CustomizationBox: Model & {
		Mount: BasePart;
		Assets: Folder;
	};
}

interface ReplicatedStorage extends Instance {
	Shared: Folder & {
		systems: Folder;
	};
	Client: Folder & {
		systems: Folder;
	};
	Assets: Folder & {
		Bullet: BasePart;
		Armor: Folder & {
			Cadet: Model;
			Guard: Model;
			Specialist: Model;
		};
		Sounds: Folder & {
			HitMarker: Sound;
		};
		Attachments: Folder & {
			[key in ATTACHMENT]: Modification;
		};
		Weapons: Folder & {
			[key in WEAPON]: Tool;
		};
		BaseCharacter: import("promise-character").CharacterRigR15;
	};
}

interface SoundService extends Instance {
	Effects: SoundGroup;
}
