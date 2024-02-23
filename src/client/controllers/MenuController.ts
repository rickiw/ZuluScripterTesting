import { Controller, OnRender, OnStart } from "@flamework/core";
import { New } from "@rbxts/fusion";
import { TweenService, UserInputService, Workspace } from "@rbxts/services";
import { ControlSet } from "client/components/controls";
import { Events } from "client/network";
import { clientStore } from "client/store";
import { selectCustomizationIsOpen } from "client/store/customization";
import { selectMenuOpen } from "client/store/menu";
import { PlayerProfile } from "shared/utils";
import { HandlesInput } from "./BaseInput";

@Controller()
export class MenuController extends HandlesInput implements OnStart, OnRender {
	menuPanel: BasePart;
	openedCFrame?: CFrame;
	cameraTween?: Tween;
	inputs = [Enum.KeyCode.M, Enum.KeyCode.ButtonL3];
	controlSet = new ControlSet();

	constructor() {
		super();
		this.menuPanel = New("Part")({
			Parent: Workspace.CurrentCamera,
			Name: "MenuPanel",
			Size: new Vector3(15, 8, 1),
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

		const offset = new Vector3(0, 0, 3);

		return camera.CFrame.mul(new CFrame(offset));
	}

	getMenuPositionOffset() {
		const offset = new CFrame(10, -1, -12.5);
		return offset;
	}

	getMenuPanelCFrame() {
		const camera = Workspace.CurrentCamera!;
		const mouse = UserInputService.GetMouseLocation();

		// add positioning offset
		const posititionalOffset = this.getMenuPositionOffset();
		const rotationalOffset = CFrame.Angles(0, math.rad(160), 0);

		// add mouse offset from center screen
		const menuPanelWorldSpace = this.menuPanel.Position;
		const [viewportPoint, visible] = camera.WorldToViewportPoint(menuPanelWorldSpace);

		const center = new Vector2(viewportPoint.X, viewportPoint.Y);
		const tiltAngleX = ((mouse.X - center.X) / center.X) * 5;
		const tiltAngleY = ((mouse.Y - center.Y) / center.Y) * 10;
		const rotation = CFrame.Angles(math.rad(tiltAngleY), math.rad(tiltAngleX), 0);

		const panelCFrame = camera.CFrame.mul(posititionalOffset).mul(rotationalOffset);
		return visible ? panelCFrame.mul(rotation) : panelCFrame;
	}

	toggleMenu() {
		const camera = Workspace.CurrentCamera!;
		const currentlyOpen = clientStore.getState(selectMenuOpen);

		if (!currentlyOpen) {
			this.openedCFrame = camera.CFrame;

			if (this.cameraTween) this.cameraTween.Cancel();

			const newCameraCFrame = this.getCameraOffsetCFrame();
			const menuPanelCFrame = this.getMenuPanelCFrame();

			this.cameraTween = TweenService.Create(camera, new TweenInfo(0.5), { CFrame: newCameraCFrame });
			this.cameraTween.Play();
			TweenService.Create(this.menuPanel, new TweenInfo(0.5), { CFrame: menuPanelCFrame }).Play();
			this.menuPanel.Transparency = 0.2;
		} else {
			this.menuPanel.Position = new Vector3(0, -100, 0);
			if (this.openedCFrame) {
				TweenService.Create(camera, new TweenInfo(0.5), { CFrame: this.openedCFrame }).Play();
				this.menuPanel.Transparency = 1;
			}
		}

		clientStore.setMenuOpen(!currentlyOpen);
	}

	onRender(dt: number) {
		const currentlyOpen = clientStore.getState(selectMenuOpen);

		if (currentlyOpen) {
			const camera = Workspace.CurrentCamera!;
			const menuPanelCFrame = this.getMenuPanelCFrame();

			this.menuPanel.CFrame = menuPanelCFrame;
		}
	}
}
