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
