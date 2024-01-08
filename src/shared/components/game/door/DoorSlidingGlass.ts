import { Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { springs } from "shared/constants/springs";
import { BaseDoor, BaseDoorAttributes, BaseDoorInstance, Door } from "./BaseDoor";

export interface DoorInstance extends BaseDoorInstance {
	LeftDoor: Model & {
		Hinge: BasePart;
	};
	RightDoor: Model & {
		Hinge: BasePart;
	};
}

interface DoorAttributes extends BaseDoorAttributes {
	offset: Vector3;
}

@Component({
	defaults: {
		autocloseDelay: 2,
		offset: new Vector3(-4.5, 0, 0),
	},
	tag: "slidingGlassDoor",
})
export class SlidingGlassDoor extends BaseDoor<DoorAttributes, DoorInstance> implements OnStart, Door {
	leftDoorOriginCFrame: CFrame;
	rightDoorOriginCFrame: CFrame;

	constructor() {
		super();

		this.leftDoorOriginCFrame = new CFrame();
		this.rightDoorOriginCFrame = new CFrame();
	}

	onMotorStep(value: number) {
		const leftDoorCFrame = this.leftDoorOriginCFrame.Lerp(
			this.leftDoorOriginCFrame.mul(new CFrame(this.attributes.offset)),
			value,
		);
		this.instance.LeftDoor.Hinge.CFrame = leftDoorCFrame;

		const rightDoorCFrame = this.rightDoorOriginCFrame.Lerp(
			this.rightDoorOriginCFrame.mul(new CFrame(this.attributes.offset.mul(-1))),
			value,
		);
		this.instance.RightDoor.Hinge.CFrame = rightDoorCFrame;
	}

	onDoorInteract(player: Player) {
		this.dutyCycle();
	}

	onStart() {
		this.bootstrap();

		this.springSettings = springs.molasses;
		this.weldDoor(this.instance.LeftDoor, this.instance.LeftDoor.Hinge);
		this.weldDoor(this.instance.RightDoor, this.instance.RightDoor.Hinge);
		this.baseMotor.onStep((value) => this.onMotorStep(value));
		this.leftDoorOriginCFrame = this.instance.LeftDoor.Hinge.CFrame;
		this.rightDoorOriginCFrame = this.instance.RightDoor.Hinge.CFrame;
		this.interacted.Connect((player) => this.onDoorInteract(player));
	}
}
