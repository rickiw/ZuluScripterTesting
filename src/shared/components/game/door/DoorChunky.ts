import { Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { springs } from "shared/constants/springs";
import { BaseDoor, BaseDoorAttributes, BaseDoorInstance, Door } from "./BaseDoor";

export interface DoorInstance extends BaseDoorInstance {
	Door: Model & {
		Hinge: BasePart;
	};
}

interface DoorAttributes extends BaseDoorAttributes {
	offset: Vector3;
}

@Component({
	defaults: {
		autocloseDelay: 2,
		offset: new Vector3(0, 6, 0),
	},
	tag: "chunkyDoor",
})
export class ChunkyDoor extends BaseDoor<DoorAttributes, DoorInstance> implements OnStart, Door {
	constructor() {
		super();
	}

	onMotorStep(value: number) {
		const newCF = this.originCFrame.Lerp(this.originCFrame.mul(new CFrame(this.attributes.offset)), value);
		this.instance.Door.Hinge.CFrame = newCF;
	}

	onDoorInteract(player: Player) {
		this.dutyCycle();
	}

	onStart() {
		this.bootstrap();

		this.springSettings = springs.molasses;
		this.weldDoor(this.instance.Door, this.instance.Door.Hinge);
		this.baseMotor.onStep((value) => this.onMotorStep(value));
		this.originCFrame = this.instance.Door.Hinge.CFrame;
		this.interacted.Connect((player) => this.onDoorInteract(player));
	}
}
