import Maid from "@rbxts/maid";
import Roact, { useEffect, useState } from "@rbxts/roact";
import { RunService, UserInputService } from "@rbxts/services";
import { FirearmInstance } from "client/components/BaseFirearm";
import { useRem } from "client/ui/hooks";
import { ViewportFrame } from "client/ui/library/viewport-frame";
import {
	CFrameToAngles,
	changeClass,
	constrainAngles,
	getModelCornerDistance,
	rotateCFrameCameraLike,
} from "shared/utils";

export interface WeaponPreviewProps {
	weapon?: FirearmInstance;
}

class Draggable {
	private viewportFrame: ViewportFrame;
	private camera: Camera;
	private lastMousePosition?: Vector2;
	private pitchLimits = new NumberRange(-90, 90);
	private model?: Model;

	private renderConn?: RBXScriptConnection;
	private inputConn?: RBXScriptConnection;

	constructor(viewportFrame: ViewportFrame, camera: Camera) {
		this.viewportFrame = viewportFrame;
		this.camera = camera;
	}

	setModel(model: Model) {
		this.model = model;

		model.Parent = this.viewportFrame;
		model.PivotTo(new CFrame());

		this.setAngles(CFrame.Angles(math.rad(180), math.rad(-90) + math.pi, math.rad(180)));
	}

	setAngles(Angles: CFrame) {
		const angles = CFrameToAngles(Angles);

		const minCameraDistance = getModelCornerDistance(this.model!);
		const cameraDistance = minCameraDistance * 1;
		const [camCenter] = this.model!.GetBoundingBox();

		this.camera.CFrame = camCenter.mul(angles).mul(new CFrame(0, 0, cameraDistance));
	}

	getMouseMovement() {
		const mousePosition = UserInputService.GetMouseLocation();
		const movement = (this.lastMousePosition || mousePosition).sub(mousePosition);
		this.lastMousePosition = mousePosition;
		return movement;
	}

	getAngles() {
		return CFrameToAngles(this.camera.CFrame);
	}

	rotate(dPitch: number, dYaw: number) {
		const MAX_ANGLE_STEP = math.rad(10);
		while (math.abs(dPitch) > MAX_ANGLE_STEP) {
			this.rotate(MAX_ANGLE_STEP * math.sign(dPitch), 0);
			dPitch -= MAX_ANGLE_STEP * math.sign(dPitch);
		}

		while (math.abs(dYaw) > MAX_ANGLE_STEP) {
			this.rotate(0, MAX_ANGLE_STEP * math.sign(dYaw));
			dYaw -= MAX_ANGLE_STEP * math.sign(dYaw);
		}

		const rotatedCFrame = rotateCFrameCameraLike(this.getAngles(), dPitch, dYaw);

		const fixedPitchLimits = this.pitchLimits;
		const limitedCFrame = constrainAngles(rotatedCFrame, fixedPitchLimits);

		this.setAngles(limitedCFrame);
	}

	beginDragging() {
		this.lastMousePosition = undefined;

		this.renderConn = RunService.RenderStepped.Connect(() => {
			UserInputService.MouseBehavior = Enum.MouseBehavior.Default;
		});

		this.inputConn = UserInputService.InputChanged.Connect((input) => {
			if (input.UserInputType === Enum.UserInputType.MouseMovement) {
				const delta = this.getMouseMovement();

				this.rotate(-delta.Y / 100, -delta.X / 100);
			}
		});
	}

	stopDragging() {
		if (this.renderConn) {
			this.renderConn.Disconnect();
			this.renderConn = undefined;
		}

		if (this.inputConn) {
			this.inputConn.Disconnect();
			this.inputConn = undefined;
		}
	}
}

export function WeaponPreview({ weapon }: WeaponPreviewProps) {
	const rem = useRem();

	const [viewportFrameRef, setViewportFrameRef] = useState<ViewportFrame | undefined>(undefined);
	const [camera, setCamera] = useState<Camera | undefined>(undefined);
	const [draggable, setDraggable] = useState<Draggable | undefined>(undefined);
	const [maid] = useState(() => new Maid());

	useEffect(() => {
		if (viewportFrameRef) {
			const camera = new Instance("Camera");
			camera.Parent = viewportFrameRef;
			camera.CameraType = Enum.CameraType.Scriptable;
			camera.CFrame = new CFrame(new Vector3(5, 0, 0), new Vector3(0, 0, 0));
			setCamera(camera);

			const draggable = new Draggable(viewportFrameRef, camera);
			setDraggable(draggable);
			maid.GiveTask(
				viewportFrameRef.InputBegan.Connect((input) => {
					if (!draggable) return;

					if (input.UserInputType === Enum.UserInputType.MouseButton1) {
						draggable.beginDragging();

						const conn = input.GetPropertyChangedSignal("UserInputState").Connect(() => {
							if (input.UserInputState === Enum.UserInputState.End) {
								draggable.stopDragging();
								conn.Disconnect();
							}
						});
					}
				}),
			);

			return () => {
				maid.DoCleaning();
			};
		}
	}, [viewportFrameRef]);

	useEffect(() => {
		if (!viewportFrameRef || !weapon || !draggable) return;
		viewportFrameRef.GetChildren().forEach((child) => {
			if (child.IsA("Model")) {
				child.Destroy();
			}
		});

		const tool = weapon.Clone();
		tool.MoveTo(new Vector3(0, 0, 0));

		const newTool = changeClass(tool, "Model");
		draggable.setModel(newTool);
	}, [weapon]);

	return (
		<ViewportFrame
			ref={setViewportFrameRef}
			backgroundTransparency={1}
			anchorPoint={new Vector2(0.5, 0.5)}
			position={UDim2.fromScale(0.5, 0.5)}
			size={UDim2.fromScale(1, 1)}
			currentCamera={camera}
		/>
	);
}
