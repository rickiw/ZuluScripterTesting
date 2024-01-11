type BaseCharacter = Model & {
	Humanoid: Humanoid;
	Body: MeshPart;
	HumanoidRootPart: BasePart;
};

type PlayerCharacterR15 = Model & {
	HumanoidRootPart: BasePart & {
		RootRigAttachment: Attachment & { OriginalPosition: Vector3Value };
		OriginalSize: Vector3Value;
	};
	LeftHand: BasePart & {
		LeftWristRigAttachment: Attachment & { OriginalPosition: Vector3Value };
		LeftGripAttachment: Attachment & { OriginalPosition: Vector3Value };
		LeftWrist: Motor6D;
		OriginalSize: Vector3Value;
	};
	LeftLowerArm: BasePart & {
		LeftElbowRigAttachment: Attachment & { OriginalPosition: Vector3Value };
		LeftWristRigAttachment: Attachment & { OriginalPosition: Vector3Value };
		LeftElbow: Motor6D;
		OriginalSize: Vector3Value;
	};
	LeftUpperArm: BasePart & {
		LeftShoulderRigAttachment: Attachment & { OriginalPosition: Vector3Value };
		LeftElbowRigAttachment: Attachment & { OriginalPosition: Vector3Value };
		LeftShoulderAttachment: Attachment & { OriginalPosition: Vector3Value };
		LeftShoulder: Motor6D;
		OriginalSize: Vector3Value;
	};
	RightHand: BasePart & {
		RightWristRigAttachment: Attachment & { OriginalPosition: Vector3Value };
		RightGripAttachment: Attachment & { OriginalPosition: Vector3Value };
		RightWrist: Motor6D;
		OriginalSize: Vector3Value;
	};
	RightLowerArm: BasePart & {
		RightElbowRigAttachment: Attachment & { OriginalPosition: Vector3Value };
		RightWristRigAttachment: Attachment & { OriginalPosition: Vector3Value };
		RightElbow: Motor6D;
		OriginalSize: Vector3Value;
	};
	RightUpperArm: BasePart & {
		RightShoulderRigAttachment: Attachment & { OriginalPosition: Vector3Value };
		RightElbowRigAttachment: Attachment & { OriginalPosition: Vector3Value };
		RightShoulderAttachment: Attachment & { OriginalPosition: Vector3Value };
		RightShoulder: Motor6D;
		OriginalSize: Vector3Value;
	};
	UpperTorso: BasePart & {
		WaistRigAttachment: Attachment & { OriginalPosition: Vector3Value };
		NeckRigAttachment: Attachment & { OriginalPosition: Vector3Value };
		LeftShoulderRigAttachment: Attachment & { OriginalPosition: Vector3Value };
		RightShoulderRigAttachment: Attachment & { OriginalPosition: Vector3Value };
		BodyFrontAttachment: Attachment & { OriginalPosition: Vector3Value };
		BodyBackAttachment: Attachment & { OriginalPosition: Vector3Value };
		LeftCollarAttachment: Attachment & { OriginalPosition: Vector3Value };
		RightCollarAttachment: Attachment & { OriginalPosition: Vector3Value };
		NeckAttachment: Attachment & { OriginalPosition: Vector3Value };
		Waist: Motor6D;
		OriginalSize: Vector3Value;
	};
	LeftFoot: BasePart & {
		LeftAnkleRigAttachment: Attachment & { OriginalPosition: Vector3Value };
		LeftAnkle: Motor6D;
		OriginalSize: Vector3Value;
	};
	LeftLowerLeg: BasePart & {
		LeftKneeRigAttachment: Attachment & { OriginalPosition: Vector3Value };
		LeftAnkleRigAttachment: Attachment & { OriginalPosition: Vector3Value };
		LeftKnee: Motor6D;
		OriginalSize: Vector3Value;
	};
	LeftUpperLeg: BasePart & {
		LeftHipRigAttachment: Attachment & { OriginalPosition: Vector3Value };
		LeftKneeRigAttachment: Attachment & { OriginalPosition: Vector3Value };
		LeftHip: Motor6D;
		OriginalSize: Vector3Value;
	};
	RightFoot: BasePart & {
		RightAnkleRigAttachment: Attachment & { OriginalPosition: Vector3Value };
		RightAnkle: Motor6D;
		OriginalSize: Vector3Value;
	};
	RightLowerLeg: BasePart & {
		RightKneeRigAttachment: Attachment & { OriginalPosition: Vector3Value };
		RightAnkleRigAttachment: Attachment & { OriginalPosition: Vector3Value };
		RightKnee: Motor6D;
		OriginalSize: Vector3Value;
	};
	RightUpperLeg: BasePart & {
		RightHipRigAttachment: Attachment & { OriginalPosition: Vector3Value };
		RightKneeRigAttachment: Attachment & { OriginalPosition: Vector3Value };
		RightHip: Motor6D;
		OriginalSize: Vector3Value;
	};
	LowerTorso: BasePart & {
		RootRigAttachment: Attachment & { OriginalPosition: Vector3Value };
		WaistRigAttachment: Attachment & { OriginalPosition: Vector3Value };
		LeftHipRigAttachment: Attachment & { OriginalPosition: Vector3Value };
		RightHipRigAttachment: Attachment & { OriginalPosition: Vector3Value };
		WaistCenterAttachment: Attachment & { OriginalPosition: Vector3Value };
		WaistFrontAttachment: Attachment & { OriginalPosition: Vector3Value };
		WaistBackAttachment: Attachment & { OriginalPosition: Vector3Value };
		Root: Motor6D;
		OriginalSize: Vector3Value;
	};
	Humanoid: Humanoid & {
		Animator: Animator;
		BodyTypeScale: NumberValue;
		BodyProportionScale: NumberValue;
		BodyWidthScale: NumberValue;
		BodyHeightScale: NumberValue;
		BodyDepthScale: NumberValue;
		HeadScale: NumberValue;
		HumanoidDescription: HumanoidDescription;
	};
	Head: BasePart & {
		FaceCenterAttachment: Attachment & { OriginalPosition: Vector3Value };
		FaceFrontAttachment: Attachment & { OriginalPosition: Vector3Value };
		HairAttachment: Attachment & { OriginalPosition: Vector3Value };
		HatAttachment: Attachment & { OriginalPosition: Vector3Value };
		NeckRigAttachment: Attachment & { OriginalPosition: Vector3Value };
		Neck: Motor6D;
		OriginalSize: Vector3Value;
	};
};

export type PlayerCharacterR6 = Model & {
	Head: Part & {
		FaceCenterAttachment: Attachment;
		FaceFrontAttachment: Attachment;
		HairAttachment: Attachment;
		HatAttachment: Attachment;
	};

	HumanoidRootPart: BasePart & {
		RootAttachment: Attachment;
		RootJoint: Motor6D;
	};

	Humanoid: Humanoid & {
		Animator: Animator;
		HumanoidDescription: HumanoidDescription;
	};

	["Left Arm"]: BasePart & {
		LeftGripAttachment: Attachment;
		LeftShoulderAttachment: Attachment;
	};

	["Left Leg"]: BasePart & {
		LeftFootAttachment: Attachment;
	};

	["Right Arm"]: BasePart & {
		RightGripAttachment: Attachment;
		RightShoulderAttachment: Attachment;
	};

	["Right Leg"]: BasePart & {
		RightFootAttachment: Attachment;
	};

	Torso: BasePart & {
		["Left Hip"]: Motor6D;
		["Left Shoulder"]: Motor6D;
		["Right Hip"]: Motor6D;
		["Right Shoulder"]: Motor6D;
		Neck: Motor6D;

		BodyBackAttachment: Attachment;
		BodyFrontAttachment: Attachment;
		LeftCollarAttachment: Attachment;
		NeckAttachment: Attachment;
		RightCollarAttachment: Attachment;
		WaistBackAttachment: Attachment;
		WaistCenterAttachment: Attachment;
		WaistFrontAttachment: Attachment;
	};

	["Body Colors"]: BodyColors;
};
