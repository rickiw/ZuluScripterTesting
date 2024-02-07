import { Controller, OnStart, OnTick } from "@flamework/core";
import { UserInputService, Workspace } from "@rbxts/services";
import { ControlSet } from "client/components/controls";
import { clientStore } from "client/store";
import {
	selectCameraDistance,
	selectCameraFOVOffset,
	selectCameraLockedCenter,
	selectCameraOffset,
	selectCameraShiftLocked,
} from "client/store/camera";
import { lerp } from "shared/utils";

let SENSITIVITY = UserSettings().GetService("UserGameSettings").MouseSensitivity / 100;
const ZOOM_SENSITIVITY = 1;
const FIELD_OF_VIEW = 70;
const Camera = Workspace.CurrentCamera!;

@Controller()
export class CameraController implements OnStart, OnTick {
	currentCameraOffset = Vector3.zero;
	additionalCameraOffset = Vector3.zero;
	controlSet = new ControlSet();

	currentCameraFOV = 0;

	lastMousePos = Vector2.zero;
	mouseDelta = Vector2.zero;

	gamepadState = Vector2.zero;

	theta = math.pi;
	phi = math.pi / 2;

	getHumanoid() {
		const character = Camera.CameraSubject?.FindFirstAncestorOfClass("Model");
		return character?.FindFirstChildWhichIsA("Humanoid");
	}

	getCharacterRoot() {
		const character = Camera.CameraSubject?.FindFirstAncestorOfClass("Model");
		return character?.FindFirstChild("HumanoidRootPart") as BasePart | undefined;
	}

	onStart() {
		clientStore.setCameraFlag("FirearmIsAiming", false);
		UserInputService.InputChanged.Connect((inputObject, gpe) => {
			if (gpe) return;

			// Handle mouse movements
			if (inputObject.UserInputType === Enum.UserInputType.MouseMovement) {
				this.handleMouseInput(inputObject);
			}

			if (inputObject.UserInputType === Enum.UserInputType.MouseWheel) {
				clientStore.setCameraDistance(
					math.clamp(
						selectCameraDistance(clientStore.getState()) - inputObject.Position.Z * ZOOM_SENSITIVITY,
						3,
						15,
					),
				);
			}

			// Handle touch movements
			if (inputObject.UserInputType === Enum.UserInputType.Touch) {
				this.handleTouchInput(inputObject);
			}

			// Update gamepad state when thumbstick movement is detected
			if (
				inputObject.UserInputType === Enum.UserInputType.Gamepad1 &&
				inputObject.KeyCode === Enum.KeyCode.Thumbstick2
			) {
				this.gamepadState = new Vector2(inputObject.Position.X, inputObject.Position.Y);
			}
		});

		const Distances = [3, 5, 15];
		let DistIdx = 1;

		this.controlSet.add({
			ID: "gamepad-zoom",
			Name: "GamepadZoom",
			Enabled: true,
			Mobile: false,

			onBegin: () => {
				DistIdx = (DistIdx + 1) % (Distances.size() - 1);
				clientStore.setCameraDistance(Distances[DistIdx]);
			},
			controls: [Enum.KeyCode.ButtonR3],
		});

		// Zoom for touch devices (pinch-to-zoom)
		UserInputService.TouchPinch.Connect((touches: Vector2[]) => {
			const state = clientStore.getState();
			const zoomSpeed = touches[0].Magnitude - touches[1].Magnitude;

			clientStore.setCameraDistance(math.clamp(selectCameraDistance(clientStore.getState()) + zoomSpeed, 0, 15));
		});
	}

	handleMouseInput(inputObject: InputObject) {
		if (
			!UserInputService.IsMouseButtonPressed(Enum.UserInputType.MouseButton2) &&
			!selectCameraLockedCenter(clientStore.getState())
		) {
			this.lastMousePos = new Vector2(inputObject.Position.X, inputObject.Position.Y);
			return;
		}

		this.mouseDelta = !selectCameraLockedCenter(clientStore.getState())
			? new Vector2(this.lastMousePos.X - inputObject.Position.X, this.lastMousePos.Y - inputObject.Position.Y)
			: new Vector2(-inputObject.Delta.X, -inputObject.Delta.Y);
		this.phi = math.clamp(this.phi - this.mouseDelta.Y * SENSITIVITY, 0, math.rad(160));
		this.theta -= this.mouseDelta.X * SENSITIVITY;
		this.lastMousePos = new Vector2(inputObject.Position.X, inputObject.Position.Y);
	}

	// Our assumed deltaTouch represents the relative movement of touch input
	handleTouchInput(inputObject: InputObject) {
		const deltaTouch = new Vector2(inputObject.Delta.X, inputObject.Delta.Y);
		this.phi = math.clamp(this.phi + deltaTouch.Y * SENSITIVITY * math.pi, 0, math.rad(160));
		this.theta -= -deltaTouch.X * SENSITIVITY * math.pi;
	}

	onTick(dt: number) {
		const State = clientStore.getState();
		const Root = this.getCharacterRoot();
		if (!Root) {
			Camera.CameraType = Enum.CameraType.Follow;
			return;
		}
		Camera.CameraType = Enum.CameraType.Scriptable;
		UserInputService.MouseBehavior =
			Enum.MouseBehavior[!selectCameraLockedCenter(State) ? "Default" : "LockCenter"];
		UserInputService.MouseIconEnabled = !selectCameraLockedCenter(clientStore.getState());
		this.additionalCameraOffset = this.getHumanoid() ? new Vector3(0, 2, 0) : Vector3.zero;
		const distance = selectCameraDistance(State);
		// add spherical to cartesian conversion, phi is elevation, theta is azimuth
		const targetCamRotation = new Vector3(
			distance * math.sin(this.phi) * math.cos(this.theta),
			distance * math.cos(this.phi),
			distance * math.sin(this.phi) * math.sin(this.theta),
		);
		this.currentCameraOffset = this.currentCameraOffset.Lerp(
			selectCameraOffset(State).add(this.additionalCameraOffset),
			0.1,
		);

		this.currentCameraFOV = FIELD_OF_VIEW + selectCameraFOVOffset(State);
		const baseCameraPosition = Root.Position;
		const lookAtPosition = baseCameraPosition.sub(targetCamRotation);

		Camera.CFrame = CFrame.lookAt(lookAtPosition, baseCameraPosition).mul(new CFrame(this.currentCameraOffset));
		Camera.FieldOfView = lerp(Camera.FieldOfView, this.currentCameraFOV, 0.1);
		const [pitch, yaw, roll] = Camera.CFrame.ToEulerAnglesYXZ();
		const isShiftLocked = selectCameraShiftLocked(State);
		if (Root && isShiftLocked) {
			Root.CFrame = Root.CFrame.Lerp(new CFrame(Root.Position).mul(CFrame.Angles(0, yaw, 0)), 0.2);
		}
		SENSITIVITY = UserSettings().GetService("UserGameSettings").MouseSensitivity / 100;
		this.phi = math.clamp(this.phi - this.gamepadState.Y * SENSITIVITY * math.pi, 0, math.rad(160));
		this.theta += this.gamepadState.X * SENSITIVITY * math.pi;
	}
}
