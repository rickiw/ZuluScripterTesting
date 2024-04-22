import { Controller, OnRender, OnStart } from "@flamework/core";
import { New } from "@rbxts/fusion";
import Log from "@rbxts/log";
import Maid from "@rbxts/maid";
import { CharacterRigR15 } from "@rbxts/promise-character";
import { Players, ReplicatedStorage, UserInputService, Workspace } from "@rbxts/services";
import { FirearmInstance } from "client/components/BaseFirearm";
import { ControlSet } from "client/components/controls";
import { clientStore } from "client/store";
import {
	selectCustomizationIsOpen,
	selectModificationPreviews,
	selectSelectedWeapon,
} from "client/store/customization";
import { selectMenuOpen, selectPlayerSave } from "client/store/menu";
import { IModification, ModificationType, WeaponBase, getWeaponEntry } from "shared/constants/weapons";

const player = Players.LocalPlayer;

@Controller()
export class CustomizationController implements OnStart, OnRender {
	controlSet = new ControlSet();
	character = (player.Character || player.CharacterAdded.Wait()[0]) as CharacterRigR15;
	maid = new Maid();
	dragging = false;

	openedCFrame?: CFrame;
	lastMousePosition?: Vector2;
	weapon?: FirearmInstance;
	attachments: BasePart[] = [];

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

		clientStore.subscribe(selectCustomizationIsOpen, () => {
			clientStore.resetPreview();
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
		for (const modification of ModificationType) {
			const guiMount = weapon.FindFirstChild(modification) as BasePart | undefined;
			if (!guiMount) {
				Log.Warn("No mount found for {@Modification}", modification);
				continue;
			}
			const attachment = guiMount.FindFirstChild("Attachment");
			const modAttachment = guiMount.FindFirstChild("ModAttachment");
			if (!attachment || !modAttachment) {
				Log.Warn("Missing attachment point for {@Modification}", modification);
				continue;
			}
			clientStore.addModificationMount(guiMount as WeaponModificationMount);
		}
	}

	getWeaponModifications(weapon: Tool) {
		const state = clientStore.getState();
		const playerSave = selectPlayerSave(state)!;
		const weaponData = getWeaponEntry(weapon.Name as WEAPON, playerSave.weaponData);
		if (weaponData) {
			const modifications: IModification[] = [];
			weaponData.attachments.forEach((modification) => {
				modifications.push({
					...modification,
					modification: ReplicatedStorage.Assets.Attachments.FindFirstChild(
						modification.modification,
					) as Modification,
				});
			});
			return modifications;
		}
		return [] as IModification[];
	}

	setupViewport(weapon: WeaponBase) {
		if (weapon.baseTool) {
			this.weapon = weapon.baseTool.Clone() as FirearmInstance;
			this.weapon.GetChildren().forEach((child) => {
				if (child.IsA("BasePart")) {
					child.Anchored = true;
				}
			});
			this.weapon.Parent = Workspace.CustomizationBox.Weapons;
			this.populateModifications(this.weapon);
			const savedWeaponModifications = this.getWeaponModifications(weapon.baseTool);
			savedWeaponModifications.forEach((modification) => {
				clientStore.addModificationPreview(modification);
			});
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

	handleModificationPreviews(modifications: IModification[]) {
		if (!this.weapon) {
			return;
		}

		const clearAttachments = () => {
			this.attachments.forEach((attachment) => {
				attachment.Destroy();
			});
		};

		clearAttachments();

		modifications.forEach((modification) => {
			const attachment = modification.modification.Clone();
			const weapon = this.weapon!;

			const modificationMount = weapon.FindFirstChild(modification.type) as WeaponModificationMount;
			if (!modificationMount) {
				Log.Warn("No modification found for {@Modification}", modification);
				return;
			}

			const attachmentOffsetPosition = attachment.Attachment.CFrame.Inverse();
			const modAttachment = modificationMount.ModAttachment;
			attachment.Parent = modificationMount;
			attachment.PivotTo(modAttachment.WorldCFrame.mul(attachmentOffsetPosition));
			New("WeldConstraint")({
				Parent: attachment,
				Part0: modificationMount,
				Part1: attachment,
			});
			this.attachments.push(attachment);
		});
	}

	toggleCustomization() {
		const state = clientStore.getState();
		const menuOpen = selectMenuOpen(state);
		if (menuOpen) {
			return;
		}

		const camera = game.Workspace.CurrentCamera!;
		const open = selectCustomizationIsOpen(state);
		clientStore.resetPreview();
		clientStore.setSelectedWeapon(undefined);

		UserInputService.MouseBehavior = Enum.MouseBehavior.Default;
		UserInputService.MouseIconEnabled = true;

		if (open) {
			camera.CFrame = this.openedCFrame!;
			camera.CameraType = Enum.CameraType.Custom;
			clientStore.setCameraLock(false);
			this.character.Humanoid.WalkSpeed = 1;
			this.maid.DoCleaning();
			Workspace.CustomizationBox.Weapons.ClearAllChildren();
		} else {
			this.character.Humanoid.UnequipTools();
			this.character.Humanoid.WalkSpeed = 0;
			clientStore.setCameraLock(true);
			camera.CameraType = Enum.CameraType.Scriptable;
			this.setCameraPosition();

			this.maid.GiveTask(
				clientStore.subscribe(selectSelectedWeapon, (newWeapon) => {
					clientStore.resetPreview();
					clientStore.clearModificationMounts();
					Workspace.CustomizationBox.Weapons.ClearAllChildren();

					if (newWeapon) {
						this.setupViewport(newWeapon);
					}
				}),
			);
			this.maid.GiveTask(
				clientStore.subscribe(selectModificationPreviews, (modifications) => {
					this.handleModificationPreviews(modifications);
				}),
			);
		}

		clientStore.setCustomizationOpen(!open);
	}

	onRender(dt: number) {
		const currentlyOpen = clientStore.getState(selectCustomizationIsOpen);
		if (currentlyOpen) {
			this.character.Humanoid.UnequipTools();
		}

		if (!this.dragging || !currentlyOpen) {
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
