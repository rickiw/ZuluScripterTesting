import { Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { springs } from "shared/constants/springs";
import { BaseDoor, BaseDoorAttributes, BaseDoorInstance, Door } from "./BaseDoor";
import { DoorService } from "./DoorService";

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
	tag: "heavyBlastDoor",
})
export class HeavyBlastDoor extends BaseDoor<DoorAttributes, DoorInstance> implements OnStart, Door {
	constructor(private doorService: DoorService) {
		super();
	}

	onMotorStep(value: number) {
		const newCFrame = this.doorService.getOffsetCFrame(this.originCFrame, this.attributes.offset, value);
		this.instance.Door.Hinge.CFrame = newCFrame;
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
