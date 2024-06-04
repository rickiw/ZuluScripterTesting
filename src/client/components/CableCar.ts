import { BaseComponent, Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import Maid from "@rbxts/maid";
import { Players, RunService, TweenService, Workspace } from "@rbxts/services";
import { Functions } from "client/network";

export interface CableCarInstance extends Model {
	Cable: Model;
	Car: Model & {
		Floor: BasePart;
		EndPosDoor: CableCarDoorPair;
		StartPosDoor: CableCarDoorPair;
	};
	Motor: Model;
	StartPosition: BasePart;
	EndPosition: BasePart;
}

export interface CableCarDoorPair extends Model {
	LeftDoor: CableCarDoor;
	RightDoor: CableCarDoor;
}

export interface CableCarDoor extends Model {
	Hinge: BasePart;
}

const DOOR_OPEN_CLOSE_TIME = 1;

/**
 * After how many seconds from stopping will door open and,
 * after how many seconds before moving will door close
 */
const DOOR_OPEN_CLOSE_DELAY = 2;
const DOOR_TWEEN_INFO = new TweenInfo(DOOR_OPEN_CLOSE_TIME, Enum.EasingStyle.Linear, Enum.EasingDirection.In);

@Component({ tag: "cableCar" })
export class MyComponent<A, I extends CableCarInstance> extends BaseComponent<A, I> implements OnStart {
	maid: Maid;
	startTime: number | undefined;
	waitingTime: number | undefined;
	travelTime: number | undefined;
	tweenStartToEnd: Tween;
	tweenEndToStart: Tween;
	lastCFrame: CFrame | undefined;
	rayCastParams: RaycastParams;

	// -- Flags
	startPosDoorOpen: boolean;
	endPosDoorOpen: boolean;

	constructor() {
		super();

		this.maid = new Maid();

		const info = Functions.getCableCarInfo.invoke().expect();
		this.startTime = info[0];
		this.waitingTime = info[1];
		this.travelTime = info[2];

		assert(this.instance.Car.PrimaryPart, "No primary part exist for car.");
		const tweenInfo = new TweenInfo(this.travelTime, Enum.EasingStyle.Linear, Enum.EasingDirection.In);
		this.tweenStartToEnd = TweenService.Create(this.instance.Car.PrimaryPart, tweenInfo, {
			CFrame: this.instance.EndPosition.CFrame,
		});
		this.tweenEndToStart = TweenService.Create(this.instance.Car.PrimaryPart, tweenInfo, {
			CFrame: this.instance.StartPosition.CFrame,
		});

		this.rayCastParams = new RaycastParams();
		this.rayCastParams.FilterType = Enum.RaycastFilterType.Include;
		this.rayCastParams.FilterDescendantsInstances = [this.instance];

		this.startPosDoorOpen = false;
		this.endPosDoorOpen = false;
	}

	onStart() {
		const connection = RunService.Heartbeat.Connect(() => {
			this.handlePlayerMovement();

			if (!this.startTime || !this.waitingTime || !this.travelTime) {
				return;
			}
			const elapsed = os.time() - this.startTime;
			const time = elapsed % (2 * (this.waitingTime + this.travelTime));
			this.runCar(time);
		});
		this.maid.GiveTask(connection);
		print("started");
	}

	runCar(time: number) {
		if (!this.startTime || !this.waitingTime || !this.travelTime) {
			return;
		}

		// Tweens
		if (time === DOOR_OPEN_CLOSE_DELAY) {
			this.openStartPosDoors();
		} else if (time === this.waitingTime - DOOR_OPEN_CLOSE_DELAY) {
			this.closeStartPosDoors();
		} else if (time === this.waitingTime) {
			this.tweenStartToEnd.Play();
		} else if (time === this.waitingTime + this.travelTime + DOOR_OPEN_CLOSE_DELAY) {
			this.openEndPosDoors();
		} else if (time === this.waitingTime + this.travelTime + this.waitingTime - DOOR_OPEN_CLOSE_DELAY) {
			this.closeEndPosDoors();
		} else if (time === this.waitingTime + this.travelTime + this.waitingTime) {
			this.tweenEndToStart.Play();
		}
	}

	handlePlayerMovement() {
		const character = Players.LocalPlayer.Character;
		if (!character) {
			return;
		}

		const result = Workspace.Raycast(character.GetPivot().Position, new Vector3(0, -10, 0), this.rayCastParams);
		if (!result) {
			this.lastCFrame = undefined;
			return;
		}
		const trainPos = this.instance.Car.GetPivot();
		this.lastCFrame = this.lastCFrame || this.instance.Car.GetPivot();

		const relative = trainPos.mul(this.lastCFrame.Inverse());
		character.PivotTo(relative.mul(character.GetPivot()));

		this.lastCFrame = trainPos;
	}

	openStartPosDoors() {
		if (this.startPosDoorOpen) {
			return;
		}
		this.startPosDoorOpen = true;

		const car = this.instance.Car;
		this.tweenDoor(car.StartPosDoor.LeftDoor, math.rad(90));
		this.tweenDoor(car.StartPosDoor.RightDoor, math.rad(-90));
	}

	closeStartPosDoors() {
		if (!this.startPosDoorOpen) {
			return;
		}
		this.startPosDoorOpen = false;

		const car = this.instance.Car;
		const leftDoorTween = this.tweenDoor(car.StartPosDoor.LeftDoor, math.rad(-90));
		this.tweenDoor(car.StartPosDoor.RightDoor, math.rad(90));

		// -- Toggling anchor
		leftDoorTween.Completed.Connect(() => {
			car.StartPosDoor.LeftDoor.Hinge.Anchored = false;
			car.StartPosDoor.RightDoor.Hinge.Anchored = false;
		});
	}

	openEndPosDoors() {
		if (this.endPosDoorOpen) {
			return;
		}
		this.endPosDoorOpen = true;

		const car = this.instance.Car;
		this.tweenDoor(car.EndPosDoor.LeftDoor, math.rad(-90));
		this.tweenDoor(car.EndPosDoor.RightDoor, math.rad(90));
	}

	closeEndPosDoors() {
		if (!this.endPosDoorOpen) {
			return;
		}
		this.endPosDoorOpen = false;

		const car = this.instance.Car;
		const leftDoorTween = this.tweenDoor(car.EndPosDoor.LeftDoor, math.rad(90));
		this.tweenDoor(car.EndPosDoor.RightDoor, math.rad(-90));

		// -- Toggling anchor
		leftDoorTween.Completed.Connect(() => {
			car.EndPosDoor.LeftDoor.Hinge.Anchored = false;
			car.EndPosDoor.RightDoor.Hinge.Anchored = false;
		});
	}

	tweenDoor(door: CableCarDoor, angle: number): Tween {
		const hinge = door.Hinge;
		hinge.Anchored = true;
		const doorAngle = CFrame.Angles(0, angle, 0);
		const doorTween = TweenService.Create(hinge, DOOR_TWEEN_INFO, { CFrame: hinge.CFrame.mul(doorAngle) });
		doorTween.Play();
		return doorTween;
	}

	override destroy() {
		super.destroy();
		this.maid.DoCleaning();
	}
}
