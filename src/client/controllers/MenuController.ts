import { Controller, OnRender, OnStart } from "@flamework/core";
import { New } from "@rbxts/fusion";
import { CharacterRigR15 } from "@rbxts/promise-character";
import { Players, TweenService, UserInputService, Workspace } from "@rbxts/services";
import { ControlSet } from "client/components/controls";
import { Events } from "client/network";
import { clientStore } from "client/store";
import { selectCustomizationIsOpen } from "client/store/customization";
import { selectMenuOpen } from "client/store/menu";
import { PlayerProfile } from "shared/utils";
import { HandlesInput } from "./BaseInput";
import { CameraController } from "./CameraController";

const Player = Players.LocalPlayer;
const Character = (Player.Character || Player.CharacterAdded.Wait()[0]) as CharacterRigR15;

const camera = Workspace.CurrentCamera!;

@Controller()
export class MenuController extends HandlesInput implements OnStart, OnRender {
	menuPanel: BasePart;
	openedCFrame?: CFrame;
	currentTween?: Tween;
	inputs = [Enum.KeyCode.M, Enum.KeyCode.ButtonL3];
	controlSet = new ControlSet();

	constructor(private cameraController: CameraController) {
		super();
		this.menuPanel = New("Part")({
			Parent: Workspace.CurrentCamera,
			Name: "MenuPanel",
			Size: new Vector3(25, 15, 1),
			CanCollide: false,
			CanQuery: false,
			Anchored: true,
			Transparency: 1,
			Material: Enum.Material.SmoothPlastic,
			Reflectance: 0.05,
			Color: Color3.fromRGB(43, 43, 43),
		});
		clientStore.setMenuPanel(this.menuPanel);
	}

	onStart() {
		this.controlSet.add({
			ID: `menucontroller-toggle`,
			Name: "Menu",
			Enabled: true,
			Mobile: false,

			onBegin: () => {
				this.toggleMenu();
			},

			controls: this.inputs,
		});

		Events.SetProfile.connect((profile: PlayerProfile) => {
			clientStore.setSave(profile);
		});
	}

	getCameraOffsetCFrame() {
		const rootPart = Character.HumanoidRootPart;
		const offset = rootPart.Position.add(rootPart.CFrame.RightVector.mul(3)).add(
			rootPart.CFrame.LookVector.mul(-3),
		);
		const menuPanelCFrame = this.getMenuPanelCFrame();
		const cameraTarget = new CFrame(offset.add(new Vector3(0, 3, 0)), menuPanelCFrame.Position);

		const position = this.cameraController.getRaycastedMaxDistance(rootPart.Position, cameraTarget);
		const finalCFrame = new CFrame(position).mul(cameraTarget.sub(cameraTarget.Position));
		return finalCFrame;
	}

	setCamera() {
		const CFrame = this.getCameraOffsetCFrame();
		this.currentTween = TweenService.Create(camera, new TweenInfo(0.6, Enum.EasingStyle.Quart), { CFrame });
		this.currentTween.Play();
	}

	getMenuPanelCFrame() {
		const rootPart = Character.HumanoidRootPart;
		const position = rootPart.CFrame.LookVector.mul(8);
		const offset = new Vector3(0, 2, 0);
		return new CFrame(rootPart.Position.add(position).add(offset), rootPart.Position.add(offset));
	}

	setMenuPanel() {
		const CFrame = this.getMenuPanelCFrame();
		this.menuPanel.CFrame = CFrame;
	}

	setCharacterVisible(visible: boolean) {
		Character.GetDescendants().forEach((child) => {
			if (child.IsA("BasePart") && child.Transparency < 1) {
				child.Transparency = visible ? 0 : 0.95;
			}
		});
	}

	toggleMenu() {
		const state = clientStore.getState();
		const customizationOpen = selectCustomizationIsOpen(state);
		if (customizationOpen) {
			return;
		}

		const currentlyOpen = clientStore.getState(selectMenuOpen);
		const isAirborne = !Character.Humanoid.FloorMaterial || Character.Humanoid.FloorMaterial === Enum.Material.Air;
		if (isAirborne) {
			return;
		}
		if (
			(this.currentTween && this.currentTween.PlaybackState === Enum.PlaybackState.Playing) ||
			(this.currentTween && this.currentTween.PlaybackState === Enum.PlaybackState.Playing)
		) {
			return;
		}

		UserInputService.MouseIconEnabled = true;
		UserInputService.MouseBehavior = Enum.MouseBehavior.Default;

		if (!currentlyOpen) {
			Character.Humanoid.UnequipTools();
			this.openedCFrame = camera.CFrame;
			clientStore.setCameraLock(true);
			camera.CameraType = Enum.CameraType.Scriptable;
			Character.Humanoid.WalkSpeed = 0;
			this.setCamera();
			this.setMenuPanel();
			this.setCharacterVisible(false);
		} else {
			this.currentTween = TweenService.Create(camera, new TweenInfo(0.6, Enum.EasingStyle.Quart), {
				CFrame: this.openedCFrame,
			});
			this.currentTween.Play();
			this.setCharacterVisible(true);
			this.currentTween.Completed.Connect(() => {
				camera.CameraType = Enum.CameraType.Custom;
				clientStore.setCameraLock(false);
				Character.Humanoid.WalkSpeed = 1;
			});
		}

		clientStore.setMenuOpen(!currentlyOpen);
	}

	onRender(dt: number) {
		const currentlyOpen = clientStore.getState(selectMenuOpen);
		if (currentlyOpen) {
			Character.Humanoid.UnequipTools();
		}
	}
}
