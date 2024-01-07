import { Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import Log from "@rbxts/log";
import { springs } from "shared/constants/springs";
import { BaseDoor, BaseDoorAttributes, BaseDoorInstance, Door } from "./BaseDoor";

export interface DoorInstance extends BaseDoorInstance {
	Hinge: BasePart;
	Door: Model;
}

@Component({
	defaults: {
		autoClose: 2,
	},
	tag: "singleSwingDoor",
})
export class SingleSwingDoor extends BaseDoor<BaseDoorAttributes, DoorInstance> implements OnStart, Door {
	constructor() {
		super();
		Log.Warn("SingleSwingDoor constructor");
	}

	onMotorStep(value: number) {
		const newCF = this.originCF.Lerp(this.originCF.mul(CFrame.Angles(0, math.pi / 1.5, 0)), value);
		this.instance.Hinge.CFrame = newCF;
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
		Log.Warn("SingleSwingDoor onStart");
		this.bootstrap();

		Log.Warn("SingleSwingDoor bootstrap");
		this.springSettings = springs.molasses;
		this.weldDoor(this.instance.Door, this.instance.Hinge);
		this.baseMotor.onStep((value) => this.onMotorStep(value));
		this.originCF = this.instance.Hinge.CFrame;
		this.interacted.Connect((player) => this.onDoorInteract(player));
	}
}
