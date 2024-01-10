import { Controller, OnRender, OnStart } from "@flamework/core";
import { New } from "@rbxts/fusion";
import { TweenService, UserInputService, Workspace } from "@rbxts/services";
import { clientStore } from "client/store";
import { selectMenuOpen } from "client/store/menu";

const INPUTS = new ReadonlySet<Enum.KeyCode>([Enum.KeyCode.H, Enum.KeyCode.ButtonX]);

@Controller()
export class MenuController implements OnStart, OnRender {
	menuPanel: BasePart;
	cameraTween?: Tween;

	constructor() {
		this.menuPanel = New("Part")({
			Parent: Workspace.CurrentCamera,
			Name: "MenuPanel",
			Size: new Vector3(16.2, 8, 1),
			Position: new Vector3(12.5, 4, -4.1),
			Orientation: new Vector3(0, 90, 0),
			CanCollide: false,
			Anchored: true,
			Transparency: 0,
			Material: Enum.Material.SmoothPlastic,
			Reflectance: 0.05,
			Color: Color3.fromRGB(0, 0, 0),
		});
		clientStore.setMenuPanel(this.menuPanel);

		const mountPosition = new Vector3(-4.5, 11.5, 89.5);
		const mountOrientation = new Vector3(-9.994, 172.969, 0.353);

		const panelPosition = new Vector3(-8.5, 10, 97.5);
		const panelOrientation = new Vector3(0, -15, 0);

		const panelPositionDiff = panelPosition.sub(mountPosition);
		const panelOrientationDiff = panelOrientation.sub(mountOrientation);
	}

	onStart() {
		UserInputService.InputBegan.Connect((input, processed) => {
			if (!processed && INPUTS.has(input.KeyCode)) {
				this.toggleMenu();
			}
		});
	}

	toggleMenu() {
		const camera = Workspace.CurrentCamera!;
		if (this.cameraTween) this.cameraTween.Cancel();
		const tweenInfo = new TweenInfo(0.5, Enum.EasingStyle.Quint, Enum.EasingDirection.Out);
		this.cameraTween = TweenService.Create(camera);
		clientStore.setMenuOpen(!clientStore.getState(selectMenuOpen));
	}

	onRender(dt: number) {
		// const camera = Workspace.CurrentCamera!;
		// const basePosition = camera.CFrame.Position.add(camera.CFrame.RightVector.mul(6));
		// const position = basePosition.add(camera.CFrame.LookVector.mul(8.5));
		// const mouse = UserInputService.GetMouseLocation();
		// const center = camera.ViewportSize.div(2);
		// const tiltAngleX = ((mouse.X - center.X) / center.X) * 5;
		// const tiltAngleY = ((mouse.Y - center.Y) / center.Y) * 10;
		// // baseRotation should be the rotation for menuPanel to face the camera
		// const rotation = CFrame.Angles(math.rad(tiltAngleY), math.rad(tiltAngleX), 0);
		// this.menuPanel.CFrame = new CFrame(position, position.add(camera.CFrame.LookVector)).mul(rotation);
	}
}
