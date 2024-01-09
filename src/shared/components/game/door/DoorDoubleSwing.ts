import { Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { springs } from "shared/constants/springs";
import { BaseDoor, BaseDoorAttributes, BaseDoorInstance, Door } from "./BaseDoor";
import { DoorService } from "./DoorService";

export interface DoorInstance extends BaseDoorInstance {
	LeftDoor: Model & {
		Hinge: BasePart;
	};
	RightDoor: Model & {
		Hinge: BasePart;
	};
}

@Component({
	defaults: {
		autocloseDelay: 2,
	},
	tag: "doubleSwingDoor",
})
export class DoubleSwingDoor extends BaseDoor<BaseDoorAttributes, DoorInstance> implements OnStart, Door {
	leftDoorOriginCFrame: CFrame;
	rightDoorOriginCFrame: CFrame;

	constructor(private doorService: DoorService) {
		super();

		this.leftDoorOriginCFrame = new CFrame();
		this.rightDoorOriginCFrame = new CFrame();
	}

	onMotorStep(value: number) {
		const leftDoorCFrame = this.doorService.getAngleCFrame(this.leftDoorOriginCFrame, 1.5, value);
		this.instance.LeftDoor.Hinge.CFrame = leftDoorCFrame;

		const rightDoorCFrame = this.doorService.getNegativeAngleCFrame(this.rightDoorOriginCFrame, 1.5, value);
		this.instance.RightDoor.Hinge.CFrame = rightDoorCFrame;
	}

	onDoorInteract(player: Player) {
		if (!this.open) {
			if (!player.Character || !player.Character.PrimaryPart) return;
			const posA = this.instance.Center.Position;
			const posB = player.Character.PrimaryPart.Position;
			const diffVector = posB.sub(posA);
			const dotProduct = this.instance.Center.CFrame.LookVector.Dot(diffVector);
			this.openMotor = dotProduct > 0 ? 1 : -1;
		}
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
