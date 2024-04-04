import { Controller, OnRender, OnStart } from "@flamework/core";
import { CharacterRigR15 } from "@rbxts/promise-character";
import { createMotion } from "@rbxts/ripple";
import { Players, UserInputService, Workspace } from "@rbxts/services";
import { ControlSet } from "client/components/controls";
import { clientStore } from "client/store";
import {
	selectCameraFlag,
	selectCameraLock,
	selectCameraLockedCenter,
	selectCameraOffset,
	selectCameraShiftLocked,
	selectCameraZoomDistance,
} from "client/store/camera";
import { springs } from "shared/constants/springs";

const SENSITIVITY = () => UserSettings().GetService("UserGameSettings").MouseSensitivity / 100;
const SCROLL_SENSITIVITY = 1;
const SCROLL_MINIMUM = 3;
const SCROLL_MAXIMUM = 15;
const CAMERA_SMOOTHING = 0.4;
const FIELD_OF_VIEW = 70;

const player = Players.LocalPlayer;
const camera = Workspace.CurrentCamera!;
const character = (player.Character ?? player.CharacterAdded.Wait()[0]) as CharacterRigR15;

@Controller()
export class CameraController implements OnStart, OnRender {
	additionalCameraOffset = Vector3.zero;
	currentCameraOffset = Vector3.zero;

	gamepadState = Vector2.zero;
	lastMousePosition = Vector2.zero;
	mouseDelta = Vector2.zero;
	phi = math.pi / 2;
	theta = math.pi;

	offsetSpring = createMotion(new Vector3(), { start: true });
	zoomSpring = createMotion(SCROLL_MAXIMUM / 2, { start: true });

	controlSet = new ControlSet();

	onStart() {
		clientStore.setCameraFlag("FirearmIsAiming", false);

		clientStore.subscribe(selectCameraOffset, (offset) => {
			this.offsetSpring.spring(offset, springs.world);
		});

		UserInputService.InputChanged.Connect((input, gpe) => {
			this.cameraInput(input, gpe);
		});
	}

	cameraInput(input: InputObject, gpe: boolean) {
		if (gpe) {
			return;
		}
		if (input.UserInputType === Enum.UserInputType.MouseMovement) {
			this.handleMouseInput(input);
		} else if (input.UserInputType === Enum.UserInputType.MouseWheel) {
			this.handleZoom(input.Position.Z);
		}
	}

	handleMouseInput(input: InputObject) {
		const state = clientStore.getState();
		const rmbPressed = UserInputService.IsMouseButtonPressed(Enum.UserInputType.MouseButton2);
		const cameraLockedCenter = selectCameraLockedCenter(state);
		if (!rmbPressed && !cameraLockedCenter) {
			this.lastMousePosition = new Vector2(input.Position.X, input.Position.Y);
			return;
		}

		this.mouseDelta = !cameraLockedCenter
			? new Vector2(this.lastMousePosition.X - input.Position.X, this.lastMousePosition.Y - input.Position.Y)
			: new Vector2(-input.Delta.X, -input.Delta.Y);
		const isAiming = selectCameraFlag("FirearmIsAiming")(state);
		const finalSensitivity = isAiming ? SENSITIVITY() * 0.5 : SENSITIVITY();
		this.phi = math.clamp(this.phi - this.mouseDelta.Y * finalSensitivity, 0, math.rad(160));
		this.theta -= this.mouseDelta.X * finalSensitivity;
		this.lastMousePosition = new Vector2(input.Position.X, input.Position.Y);
	}

	handleZoom(Z: number) {
		const state = clientStore.getState();
		const newPosition = Z * SCROLL_SENSITIVITY;
		const currentZoom = selectCameraZoomDistance(state);
		const newZoom = math.clamp(currentZoom - newPosition, SCROLL_MINIMUM, SCROLL_MAXIMUM);
		this.zoomSpring.spring(newZoom, { damping: 0.78 });
		clientStore.setCameraZoomDistance(newZoom);
	}

	getRaycastedMaxDistance(center: Vector3, newCFrame: CFrame) {
		const parameters = new RaycastParams();
		parameters.FilterDescendantsInstances = [
			character,
			...character.GetDescendants().filter((instance) => instance.IsA("BasePart")),
		];
		parameters.FilterType = Enum.RaycastFilterType.Exclude;

		const raycast = Workspace.Raycast(center, newCFrame.Position.sub(center), parameters);

		if (raycast && raycast.Instance.Transparency <= 0.05) {
			return raycast.Position.add(raycast.Normal);
		} else {
			return center.add(newCFrame.Position.sub(center));
		}
	}

	matchCharacterRotation() {
		const state = clientStore.getState();
		const rootPart = character.HumanoidRootPart;
		const [pitch, yaw, roll] = camera.CFrame.ToEulerAnglesYXZ();
		const isShiftLocked = selectCameraShiftLocked(state);
		if (isShiftLocked && rootPart) {
			rootPart.CFrame = new CFrame(rootPart.Position).mul(CFrame.Angles(0, yaw, 0));
		}
	}

	updateCamera() {
		const state = clientStore.getState();
		const rootPart = character.HumanoidRootPart;
		if (selectCameraLock(state)) {
			return;
		}

		camera.CameraType = !rootPart ? Enum.CameraType.Follow : Enum.CameraType.Scriptable;

		const cameraLockedCenter = selectCameraLockedCenter(state);
		UserInputService.MouseBehavior = !cameraLockedCenter
			? Enum.MouseBehavior.Default
			: Enum.MouseBehavior.LockCenter;
		UserInputService.MouseIconEnabled = !cameraLockedCenter;

		this.additionalCameraOffset = new Vector3(0, 2, 0);

		const zoomDistance = this.zoomSpring.get();
		const cameraOffset = this.offsetSpring.get();

		const targetCameraRotation = new Vector3(
			zoomDistance * math.sin(this.phi) * math.cos(this.theta),
			math.clamp(zoomDistance * math.cos(this.phi), -5, 5),
			zoomDistance * math.sin(this.phi) * math.sin(this.theta),
		);

		this.currentCameraOffset = this.currentCameraOffset.Lerp(cameraOffset.add(this.additionalCameraOffset), 0.1);

		const baseCameraPosition = rootPart.Position;
		const lookAtPosition = baseCameraPosition.sub(targetCameraRotation);

		const cameraBaseTarget = CFrame.lookAt(lookAtPosition, baseCameraPosition);
		const cameraTarget = cameraBaseTarget.mul(new CFrame(this.currentCameraOffset));

		const position = this.getRaycastedMaxDistance(baseCameraPosition, cameraTarget);
		const finalCFrame = new CFrame(position).mul(cameraTarget.sub(cameraTarget.Position));

		const finalCameraTarget = camera.CFrame.Lerp(finalCFrame, CAMERA_SMOOTHING);

		camera.CFrame = finalCameraTarget;

		this.matchCharacterRotation();

		this.phi = math.clamp(this.phi - this.gamepadState.Y * SENSITIVITY() * math.pi, 0, math.rad(160));
		this.theta += this.gamepadState.X * SENSITIVITY() * math.pi;
	}

	onRender(dt: number) {
		this.updateCamera();
	}
}
