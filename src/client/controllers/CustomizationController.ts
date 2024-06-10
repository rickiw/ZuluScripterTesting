import { Controller, OnStart } from "@flamework/core";
import Maid from "@rbxts/maid";
import { CharacterRigR15 } from "@rbxts/promise-character";
import { Players, UserInputService, Workspace } from "@rbxts/services";
import { ControlSet } from "client/components/controls";
import { clientStore } from "client/store";
import { selectCustomizationIsOpen, selectCustomizationPage } from "client/store/customization";
import { selectMenuOpen } from "client/store/menu";
import { CharacterCustomizationController } from "./CharacterCustomizationController";
import { WeaponCustomizationController } from "./WeaponCustomizationController";

const camera = game.Workspace.CurrentCamera!;
const player = Players.LocalPlayer;
const mouse = player.GetMouse();
@Controller()
export class CustomizationController implements OnStart {
	character = (player.Character || player.CharacterAdded.Wait()[0]) as CharacterRigR15;
	controlSet = new ControlSet();
	maid = new Maid();

	openedCFrame?: CFrame;

	constructor(
		private characterCustomization: CharacterCustomizationController,
		private weaponCustomization: WeaponCustomizationController,
	) {}

	onStart() {
		this.controlSet.add({
			ID: `customization-toggle`,
			Name: "Customization",
			Enabled: true,
			Mobile: false,

			onBegin: () => {
				this.toggleCustomizationMenu();
			},

			controls: [Enum.KeyCode.X, Enum.KeyCode.DPadUp],
		});
	}

	canOpenCustomization() {
		const state = clientStore.getState();
		const menuOpen = selectMenuOpen(state);
		return !menuOpen;
	}

	setCameraPosition() {
		const customizationBox = Workspace.CustomizationBox;
		this.openedCFrame = camera.CFrame;
		camera.CFrame = customizationBox.Mount.CFrame;
	}

	openMenu() {
		this.character.Humanoid.UnequipTools();
		this.character.Humanoid.WalkSpeed = 0;

		clientStore.setCameraLock(true);
		camera.CameraType = Enum.CameraType.Scriptable;
		task.delay(0.05, () => this.setCameraPosition());

		this.maid.GiveTask(this.characterCustomization.watchSelectedItem());
		this.maid.GiveTask(this.characterCustomization.watchAdditionalItem());
		this.maid.GiveTask(this.characterCustomization.watchDragging());
		this.controlSet.add({
			ID: `character-rotation`,
			Name: "CharacterRotation",
			Enabled: true,
			Mobile: false,

			once: (state) => {
				this.characterCustomization.lastMousePosition = UserInputService.GetMouseLocation();
				this.characterCustomization.dragging = state === Enum.UserInputState.Begin;
			},
			onEnd: () => {
				UserInputService.MouseBehavior = Enum.MouseBehavior.Default;
				this.characterCustomization.dragging = false;
			},

			controls: [Enum.UserInputType.MouseButton1],
		});

		this.maid.GiveTask(this.weaponCustomization.watchSelectedItem());
		this.maid.GiveTask(this.weaponCustomization.watchAdditionalItem());

		this.maid.GiveTask(
			clientStore.subscribe(selectCustomizationPage, (page, oldPage) => {
				if (oldPage === "character") {
					this.characterCustomization.cleanPreview();
				} else if (oldPage === "weapon") {
					this.weaponCustomization.cleanPreview();
				}
			}),
		);
	}

	closeMenu() {
		camera.CFrame = this.openedCFrame!;
		camera.CameraType = Enum.CameraType.Custom;
		clientStore.setCameraLock(false);
		this.character.Humanoid.WalkSpeed = 1;
		this.controlSet.remove("character-rotation");
		this.maid.DoCleaning();
		Workspace.CustomizationBox.Weapons.ClearAllChildren();
	}

	cleanPreviews() {
		this.characterCustomization.cleanPreview();
		this.weaponCustomization.cleanPreview();
	}

	toggleCustomizationMenu() {
		const canOpenCustomizationMenu = this.canOpenCustomization();
		if (!canOpenCustomizationMenu) {
			return;
		}

		const state = clientStore.getState();
		const customizationOpen = selectCustomizationIsOpen(state);

		UserInputService.MouseBehavior = Enum.MouseBehavior.Default;
		UserInputService.MouseIconEnabled = true;

		if (customizationOpen) {
			this.closeMenu();
		} else {
			this.openMenu();
		}

		clientStore.setCustomizationOpen(!customizationOpen);
	}
}
