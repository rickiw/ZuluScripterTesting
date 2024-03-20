import { Controller, OnStart, OnTick } from "@flamework/core";
import { CharacterRigR15 } from "@rbxts/promise-character";
import { Players, UserInputService, Workspace } from "@rbxts/services";
import { ControlSet } from "client/components/controls";
import { clientStore } from "client/store";
import {
	selectCameraFOVOffset,
	selectCameraFlag,
	selectCameraLock,
	selectCameraLockedCenter,
	selectCameraOffset,
	selectCameraShiftLocked,
	selectCameraZoomDistance,
} from "client/store/camera";
import { lerp } from "shared/utils";

let SENSITIVITY = UserSettings().GetService("UserGameSettings").MouseSensitivity / 100;
const SCROLL_SENSITIVITY = 1;
const CAMERA_SMOOTHING = 0.5;
const FIELD_OF_VIEW = 70;
const Camera = Workspace.CurrentCamera!;

const player = Players.LocalPlayer;
const character = (player.Character ?? player.CharacterAdded.Wait()[0]) as CharacterRigR15;

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

	onStart() {
		clientStore.setCameraFlag("FirearmIsAiming", false);
		UserInputService.InputChanged.Connect((inputObject, gpe) => {
			if (gpe) {
				return;
			}

			// Handle mouse movements
			if (inputObject.UserInputType === Enum.UserInputType.MouseMovement) {
				this.handleMouseInput(inputObject);
			}

			const state = clientStore.getState();

			if (inputObject.UserInputType === Enum.UserInputType.MouseWheel) {
				clientStore.setCameraZoomDistance(
					math.clamp(selectCameraZoomDistance(state) - inputObject.Position.Z * SCROLL_SENSITIVITY, 3, 15),
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
				clientStore.setCameraZoomDistance(Distances[DistIdx]);
			},
			controls: [Enum.KeyCode.ButtonR3],
		});

		// Zoom for touch devices (pinch-to-zoom)
		UserInputService.TouchPinch.Connect((touches: Vector2[]) => {
			const state = clientStore.getState();
			const zoomSpeed = touches[0].Magnitude - touches[1].Magnitude;
			const currentZoom = selectCameraZoomDistance(state);

			clientStore.setCameraZoomDistance(math.clamp(currentZoom + zoomSpeed, 0, 15));
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
		const state = clientStore.getState();
		if (selectCameraLock(state)) return;

		const humanoidRootPart = character.HumanoidRootPart;
		Camera.CameraType = !humanoidRootPart ? Enum.CameraType.Follow : Enum.CameraType.Scriptable;

		const mouseBehavior = !selectCameraLockedCenter(state)
			? Enum.MouseBehavior.Default
			: Enum.MouseBehavior.LockCenter;
		UserInputService.MouseBehavior = mouseBehavior;
		UserInputService.MouseIconEnabled = !selectCameraLockedCenter(state);

		this.additionalCameraOffset = new Vector3(0, 2.05, 0);

		const zoomDistance = selectCameraZoomDistance(state);

		// Log.Warn(
		// 	"zDist: {@ZDist} {@CLamped}",
		// 	zoomDistance * math.cos(this.phi),
		// 	math.clamp(zoomDistance * math.cos(this.phi), -5, 5),
		// );
		// add spherical to cartesian conversion, phi is elevation, theta is azimuth
		const targetCamRotation = new Vector3(
			zoomDistance * math.sin(this.phi) * math.cos(this.theta),
			math.clamp(zoomDistance * math.cos(this.phi), -5, 5),
			zoomDistance * math.sin(this.phi) * math.sin(this.theta),
		);

		this.currentCameraOffset = this.currentCameraOffset.Lerp(
			selectCameraOffset(state).add(this.additionalCameraOffset),
			0.1,
		);

		this.currentCameraFOV = FIELD_OF_VIEW + selectCameraFOVOffset(state);
		const baseCameraPosition = humanoidRootPart.Position;
		const lookAtPosition = baseCameraPosition.sub(targetCamRotation);

		const cameraBaseTarget = CFrame.lookAt(lookAtPosition, baseCameraPosition);
		const cameraTarget = cameraBaseTarget.mul(new CFrame(this.currentCameraOffset));

		const finalCameraTarget = Camera.CFrame.Lerp(cameraTarget, CAMERA_SMOOTHING);

		Camera.CFrame = finalCameraTarget;
		Camera.FieldOfView = lerp(Camera.FieldOfView, this.currentCameraFOV, 0.1);

		// Rotate body to face the camera
		const [pitch, yaw, roll] = Camera.CFrame.ToEulerAnglesYXZ();
		const isShiftLocked = selectCameraShiftLocked(state);
		if (isShiftLocked && humanoidRootPart) {
			humanoidRootPart.CFrame = new CFrame(humanoidRootPart.Position).mul(CFrame.Angles(0, yaw, 0));
		}

		SENSITIVITY = UserSettings().GetService("UserGameSettings").MouseSensitivity / 100;

		const isAiming = selectCameraFlag("FirearmIsAiming")(state);
		const aimMultiplier = isAiming ? 0.5 : 1;

		this.phi = math.clamp(
			this.phi - this.gamepadState.Y * (SENSITIVITY * aimMultiplier) * math.pi,
			0,
			math.rad(160),
		);
		this.theta += this.gamepadState.X * (SENSITIVITY * aimMultiplier) * math.pi;
	}
}
