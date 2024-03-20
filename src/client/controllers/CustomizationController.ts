import { Controller, OnStart, OnTick } from "@flamework/core";
import Log from "@rbxts/log";
import Maid from "@rbxts/maid";
import { CharacterRigR15 } from "@rbxts/promise-character";
import { Players, ReplicatedStorage, UserInputService, Workspace } from "@rbxts/services";
import { FirearmInstance } from "client/components/BaseFirearm";
import { ControlSet } from "client/components/controls";
import { clientStore } from "client/store";
import { selectCustomizationIsOpen, selectSelectedWeapon } from "client/store/customization";
import { selectMenuOpen } from "client/store/menu";

const player = Players.LocalPlayer;

@Controller()
export class CustomizationController implements OnStart, OnTick {
	controlSet = new ControlSet();
	character = (player.Character || player.CharacterAdded.Wait()[0]) as CharacterRigR15;
	maid = new Maid();
	dragging = false;

	openedCFrame?: CFrame;
	lastMousePosition?: Vector2;
	weapon?: FirearmInstance;

	constructor() {}

	onStart() {
		this.controlSet.add({
			ID: `customization-toggle`,
			Name: "Customization",
			Enabled: true,
			Mobile: false,

			onBegin: () => {
				this.toggleCustomization();
			},

			controls: [Enum.KeyCode.C, Enum.KeyCode.DPadUp],
		});
	}

	setCameraPosition() {
		const camera = game.Workspace.CurrentCamera!;
		const customizationBox = Workspace.CustomizationBox;
		this.openedCFrame = camera.CFrame;
		camera.CFrame = customizationBox.Mount.CFrame;
	}

	startDragListener() {
		this.maid.GiveTask(
			UserInputService.InputBegan.Connect((input, gpe) => {
				if (gpe) {
					return;
				}

				if (input.UserInputType === Enum.UserInputType.MouseButton2) {
					this.dragging = true;
					this.lastMousePosition = UserInputService.GetMouseLocation();
				}
			}),
		);

		this.maid.GiveTask(
			UserInputService.InputEnded.Connect((input, gpe) => {
				if (gpe) {
					return;
				}

				if (input.UserInputType === Enum.UserInputType.MouseButton2) {
					this.dragging = false;
				}
			}),
		);
	}

	rotate(x: number, y: number) {
		const weapon = this.weapon!;
		Log.Warn("Rotating weapon {X}, {Y} | {@Pivot}", x, y, weapon.GetPivot().ToOrientation());
		weapon.PivotTo(weapon.GetPivot().mul(CFrame.Angles(x, y, 0)));
	}

	populateModifications(weapon: FirearmInstance) {
		const toAdd: string[] = ["Mag", "Sights", "Handguard"];

		for (const modification of toAdd) {
			const guiMount = weapon.FindFirstChild(modification) as BasePart | undefined;
			if (!guiMount) {
				Log.Warn("No mount found for {@Modification}", modification);
				continue;
			}
			const attachment = guiMount.FindFirstChildOfClass("Attachment");
			if (!attachment) {
				Log.Warn("No attachment found for {@Modification}", modification);
				continue;
			}
			clientStore.addModification({
				part: guiMount,
				attachment,
			});
		}
	}

	setupViewport(weapon: string) {
		const tool = ReplicatedStorage.Assets.Weapons.FindFirstChild(weapon);
		if (tool) {
			clientStore.clearModifications();
			Workspace.CustomizationBox.Weapons.ClearAllChildren();
			this.weapon = tool.Clone() as FirearmInstance;
			this.weapon.Parent = Workspace.CustomizationBox.Weapons;
			this.populateModifications(this.weapon);
			const cframe = new CFrame(
				Workspace.CustomizationBox.Mount.Position.add(
					Workspace.CustomizationBox.Mount.CFrame.LookVector.mul(4),
				),
			).mul(CFrame.Angles(0, math.rad(90), 0));
			this.weapon.PivotTo(cframe);
			this.startDragListener();
		} else {
			Log.Warn("No tool found with name " + weapon);
		}
	}

	toggleCustomization() {
		Log.Warn("Toggling customization");
		const state = clientStore.getState();
		const menuOpen = selectMenuOpen(state);
		if (menuOpen) {
			return;
		}

		const camera = game.Workspace.CurrentCamera!;
		const open = selectCustomizationIsOpen(state);

		if (open) {
			camera.CFrame = this.openedCFrame!;
			clientStore.setCameraLock(false);
			this.character.Humanoid.WalkSpeed = 1;
			Workspace.CustomizationBox.Weapons.ClearAllChildren();
		} else {
			this.character.Humanoid.WalkSpeed = 0;
			clientStore.setCameraLock(true);
			this.setCameraPosition();
			this.maid.GiveTask(
				clientStore.subscribe(selectSelectedWeapon, (newWeapon) => {
					this.setupViewport(newWeapon);
				}),
			);
		}

		clientStore.setCustomizationOpen(!open);
	}

	onTick(dt: number) {
		if (!this.dragging) {
			return;
		}

		const weapon = this.weapon;
		if (!weapon) {
			return;
		}

		const currentMousePosition = UserInputService.GetMouseLocation();
		const delta = currentMousePosition.sub(this.lastMousePosition!);
		const sensitivity = new Vector3(0.01, 0.01, 0.01);

		const rotationDelta = new Vector3(0, delta.X * sensitivity.Y, 0);

		weapon.PivotTo(weapon.GetPivot().Lerp(weapon.GetPivot().mul(CFrame.Angles(0, rotationDelta.Y, 0)), 0.5));

		this.lastMousePosition = currentMousePosition;
	}
}
