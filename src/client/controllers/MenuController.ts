import { Controller, OnRender, OnStart } from "@flamework/core";
import { New } from "@rbxts/fusion";
import { CharacterRigR15 } from "@rbxts/promise-character";
import { Players, TweenService, Workspace } from "@rbxts/services";
import { ControlSet } from "client/components/controls";
import { Events } from "client/network";
import { clientStore } from "client/store";
import { selectCustomizationIsOpen } from "client/store/customization";
import { selectMenuOpen } from "client/store/menu";
import { PlayerProfile } from "shared/utils";
import { HandlesInput } from "./BaseInput";

const Player = Players.LocalPlayer;
const Character = (Player.Character || Player.CharacterAdded.Wait()[0]) as CharacterRigR15;

@Controller()
export class MenuController extends HandlesInput implements OnStart, OnRender {
	menuPanel: BasePart;
	openedCFrame?: CFrame;
	currentTween?: Tween;
	inputs = [Enum.KeyCode.M, Enum.KeyCode.ButtonL3];
	controlSet = new ControlSet();

	constructor() {
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

		this.controlSet.add({
			ID: `customization-toggle`,
			Name: "Customize",
			Enabled: true,
			Mobile: false,

			onBegin: () => {
				clientStore.setCustomizationOpen(!selectCustomizationIsOpen(clientStore.getState()));
			},

			controls: [Enum.KeyCode.C, Enum.KeyCode.ButtonSelect],
		});

		Events.SetProfile.connect((profile: PlayerProfile) => {
			clientStore.setSave(profile);
		});
	}

	getCameraOffsetCFrame() {
		const camera = Workspace.CurrentCamera!;

		const hrp = Character.HumanoidRootPart;
		const offset = hrp.Position.add(hrp.CFrame.RightVector.mul(5)).add(hrp.CFrame.LookVector.mul(-3));

		return new CFrame(offset.add(new Vector3(0, 3, 0)), this.getMenuPanelCFrame().Position);
	}

	setCamera() {
		const camera = Workspace.CurrentCamera!;
		const CFrame = this.getCameraOffsetCFrame();
		this.currentTween = TweenService.Create(camera, new TweenInfo(0.6, Enum.EasingStyle.Quart), { CFrame });
		this.currentTween.Play();
	}

	getMenuPanelCFrame() {
		const hrp = Character.HumanoidRootPart;
		const position = hrp.CFrame.LookVector.mul(10);
		const offset = new Vector3(0, 2, 0);
		return new CFrame(hrp.Position.add(position).add(offset), hrp.Position.add(offset));
	}

	setMenuPanel() {
		const CFrame = this.getMenuPanelCFrame();
		this.menuPanel.CFrame = CFrame;
	}

	toggleMenu() {
		const camera = Workspace.CurrentCamera!;
		const currentlyOpen = clientStore.getState(selectMenuOpen);
		const isAirborne = !Character.Humanoid.FloorMaterial || Character.Humanoid.FloorMaterial === Enum.Material.Air;
		if (isAirborne) return;
		if (
			(this.currentTween && this.currentTween.PlaybackState === Enum.PlaybackState.Playing) ||
			(this.currentTween && this.currentTween.PlaybackState === Enum.PlaybackState.Playing)
		)
			return;

		if (!currentlyOpen) {
			Character.Humanoid.UnequipTools();
			this.openedCFrame = camera.CFrame;
			clientStore.setCameraLock(true);
			Character.Humanoid.WalkSpeed = 0;
			this.setCamera();
			this.setMenuPanel();
		} else {
			this.currentTween = TweenService.Create(camera, new TweenInfo(0.6, Enum.EasingStyle.Quart), {
				CFrame: this.openedCFrame,
			});
			this.currentTween.Play();
			this.currentTween.Completed.Connect(() => {
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
