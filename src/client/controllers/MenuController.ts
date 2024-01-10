import { Controller, OnRender, OnStart } from "@flamework/core";
import { New } from "@rbxts/fusion";
import { Players, UserInputService, Workspace } from "@rbxts/services";
import { clientStore } from "client/store";
import { selectMenuOpen } from "client/store/menu";

const INPUTS = new ReadonlySet<Enum.KeyCode>([Enum.KeyCode.H, Enum.KeyCode.ButtonX]);

const player = Players.LocalPlayer;

@Controller()
export class MenuController implements OnStart, OnRender {
	menuPanel: BasePart;
	cameraTween?: Tween;
	camStartCf?: CFrame;

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

	getCameraOffsetPosition() {}

	getMenuPanelPosition() {
		const camera = Workspace.CurrentCamera!;
		const cameraLook = camera.CFrame.LookVector;
		const cameraRight = camera.CFrame.RightVector;
		const character = player.Character || player.CharacterAdded.Wait()[0];
		const humanoidRootPart = character.FindFirstChild("HumanoidRootPart") as BasePart;

		const offset = cameraRight.mul(8.5);
		const offsetPosition = humanoidRootPart.Position.add(cameraLook.mul(offset.Z)).add(cameraRight.mul(offset.X));
		return offsetPosition;
	}

	toggleMenu() {
		const camera = Workspace.CurrentCamera!;
		const currentlyOpen = clientStore.getState(selectMenuOpen);
		if (this.cameraTween) this.cameraTween.Cancel();
		if (!currentlyOpen) {
			const panelPosition = this.getMenuPanelPosition();
			this.menuPanel.CFrame = new CFrame(panelPosition, camera.CFrame.Position);
			this.camStartCf = camera.CFrame;
			// this.cameraTween = TweenService.Create(camera, new TweenInfo(0.4, Enum.EasingStyle.Quad), {
			// 	CFrame:
			// });
		}

		clientStore.setMenuOpen(!currentlyOpen);
	}

	onRender(dt: number) {
		const camera = Workspace.CurrentCamera!;
		const menuOpen = clientStore.getState(selectMenuOpen);
		if (!menuOpen) return;
		camera.CFrame = this.camStartCf!;
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
