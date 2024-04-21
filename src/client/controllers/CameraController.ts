import { Controller, OnRender, OnStart } from "@flamework/core";
import { CharacterRigR15 } from "@rbxts/promise-character";
import { createMotion } from "@rbxts/ripple";
import { Players, UserInputService, Workspace } from "@rbxts/services";
import { ControlSet } from "client/components/controls";
import { clientStore } from "client/store";
import {
	selectCameraBias,
	selectCameraExtraOffset,
	selectCameraFlag,
	selectCameraLock,
	selectCameraLockedCenter,
	selectCameraOffset,
	selectCameraRecoil,
	selectCameraShiftLocked,
	selectCameraZoomDistance,
} from "client/store/camera";
import { springs } from "shared/constants/springs";

const SENSITIVITY = () => UserSettings().GetService("UserGameSettings").MouseSensitivity / 100;
const SCROLL_SENSITIVITY = 1;
const SCROLL_MINIMUM = 3;
const SCROLL_MAXIMUM = 10;
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
	characterSpring = createMotion(new CFrame(), { start: true });

	controlSet = new ControlSet();

	originalCFrames: { upperTorso: CFrame; rightArm: CFrame; leftArm: CFrame } = {
		upperTorso: new CFrame(),
		rightArm: new CFrame(),
		leftArm: new CFrame(),
	};

	onStart() {
		clientStore.setCameraFlag("FirearmIsAiming", false);

		clientStore.subscribe(selectCameraOffset, (offset) => {
			this.offsetSpring.spring(offset, springs.orbit);
		});

		clientStore.subscribe(selectCameraBias, (bias) => {
			const aiming = clientStore.getState(selectCameraFlag("FirearmIsAiming"));
			if (aiming) {
				this.handleZoomAimOffset();
			}
		});

		UserInputService.InputChanged.Connect((input, gpe) => {
			this.cameraInput(input, gpe);
		});

		this.originalCFrames.leftArm = character.LeftUpperArm.LeftShoulder.C0;
		this.originalCFrames.rightArm = character.RightUpperArm.RightShoulder.C0;
		this.originalCFrames.upperTorso = character.UpperTorso.Waist.C0;
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

	handleZoomAimOffset() {
		const state = clientStore.getState();
		const bias = selectCameraBias(state).right ? 1 : -1;
		const zoom = selectCameraZoomDistance(state);
		const extraOffset = new Vector3(bias * (zoom / 5), 0, 0);
		clientStore.setExtraCameraOffset(extraOffset);
	}

	handleZoom(Z: number) {
		const state = clientStore.getState();
		const newPosition = Z * SCROLL_SENSITIVITY;
		const currentZoom = selectCameraZoomDistance(state);
		const aiming = selectCameraFlag("FirearmIsAiming")(state);
		const newZoom = math.clamp(currentZoom - newPosition, SCROLL_MINIMUM, SCROLL_MAXIMUM);
		this.zoomSpring.spring(newZoom, { damping: 0.78 });
		clientStore.setCameraZoomDistance(newZoom);

		if (aiming) {
			this.handleZoomAimOffset();
		} else {
			clientStore.setExtraCameraOffset(Vector3.zero);
		}
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
			this.characterSpring.spring(CFrame.Angles(0, yaw, 0), springs.orbit);
			rootPart.CFrame = new CFrame(rootPart.Position).mul(this.characterSpring.get());
		}
	}

	matchCharacterCamera(recoil: CFrame, newCFrame: CFrame) {
		const state = clientStore.getState();
		const isAiming = selectCameraFlag("FirearmIsAiming")(state);
		if (!isAiming) {
			character.UpperTorso.Waist.C0 = character.UpperTorso.Waist.C0.Lerp(this.originalCFrames.upperTorso, 0.15);
			character.RightUpperArm.RightShoulder.C0 = character.RightUpperArm.RightShoulder.C0.Lerp(
				this.originalCFrames.rightArm,
				0.15,
			);
			character.LeftUpperArm.LeftShoulder.C0 = character.LeftUpperArm.LeftShoulder.C0.Lerp(
				this.originalCFrames.leftArm,
				0.15,
			);
			return;
		}

		if (
			character.FindFirstChild("Neck", true) &&
			character.FindFirstChild("Waist", true) &&
			character.FindFirstChild("LeftShoulder", true) &&
			character.FindFirstChild("RightShoulder", true)
		) {
			character.HumanoidRootPart.CFrame = character.HumanoidRootPart.CFrame.Lerp(
				new CFrame(
					character.HumanoidRootPart.CFrame.Position,
					character.HumanoidRootPart.CFrame.Position.add(newCFrame.LookVector.mul(new Vector3(1, 0, 1))),
				),
				0.15,
			);
			character.UpperTorso.Waist.C0 = character.UpperTorso.Waist.C0.Lerp(
				new CFrame(character.UpperTorso.Waist.C0.Position).mul(
					CFrame.Angles(camera.CFrame.LookVector.Y * 0.8 + recoil.Position.Y * 0.1, 0, 0),
				),
				0.4,
			);
			character.RightUpperArm.RightShoulder.C0 = character.RightUpperArm.RightShoulder.C0.Lerp(
				new CFrame(character.RightUpperArm.RightShoulder.C0.Position).mul(
					CFrame.Angles(camera.CFrame.LookVector.Y * 0.3 + recoil.Position.Y * 0.8, 0, 0),
				),
				0.1,
			);
			character.LeftUpperArm.LeftShoulder.C0 = character.LeftUpperArm.LeftShoulder.C0.Lerp(
				new CFrame(character.LeftUpperArm.LeftShoulder.C0.Position).mul(
					CFrame.Angles(camera.CFrame.LookVector.Y * 0.3 + recoil.Position.Y * 0.8, 0, 0),
				),
				0.1,
			);
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
		const extraCameraOffset = selectCameraExtraOffset(state);
		const cameraOffset = this.offsetSpring.get().add(extraCameraOffset);

		const targetCameraRotation = new Vector3(
			zoomDistance * math.sin(this.phi) * math.cos(this.theta),
			math.clamp(zoomDistance * math.cos(this.phi), -5, 5),
			zoomDistance * math.sin(this.phi) * math.sin(this.theta),
		);

		this.currentCameraOffset = this.currentCameraOffset.Lerp(cameraOffset.add(this.additionalCameraOffset), 0.1);

		const baseCameraPosition = rootPart.Position;
		const recoil = selectCameraRecoil(state);
		const lookAtPosition = baseCameraPosition.sub(targetCameraRotation).add(recoil.Position);

		const cameraBaseTarget = CFrame.lookAt(lookAtPosition, baseCameraPosition);
		const cameraTarget = cameraBaseTarget.mul(new CFrame(this.currentCameraOffset));

		const position = this.getRaycastedMaxDistance(baseCameraPosition, cameraTarget);
		const finalCFrame = new CFrame(position).mul(cameraTarget.sub(cameraTarget.Position));

		const finalCameraTarget = camera.CFrame.Lerp(finalCFrame, CAMERA_SMOOTHING);

		camera.CFrame = finalCameraTarget;

		this.matchCharacterCamera(recoil, finalCameraTarget);
		this.matchCharacterRotation();

		this.phi = math.clamp(this.phi - this.gamepadState.Y * SENSITIVITY() * math.pi, math.rad(40), math.rad(160));
		this.theta += this.gamepadState.X * SENSITIVITY() * math.pi;
	}

	onRender(dt: number) {
		this.updateCamera();
	}
}
