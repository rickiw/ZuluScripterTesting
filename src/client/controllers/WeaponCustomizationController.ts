import { Controller, OnRender, OnStart } from "@flamework/core";
import { New } from "@rbxts/fusion";
import Log from "@rbxts/log";
import Maid from "@rbxts/maid";
import { CharacterRigR15 } from "@rbxts/promise-character";
import { Players, ReplicatedStorage, UserInputService, Workspace } from "@rbxts/services";
import { FirearmInstance } from "client/components/BaseFirearm";
import { clientStore } from "client/store";
import {
	selectCustomizationIsOpen,
	selectModificationPreviews,
	selectSelectedWeapon,
} from "client/store/customization";
import { selectPlayerSave } from "client/store/menu";
import { IModification, ModificationType, WeaponBase, getWeaponEntry } from "shared/constants/weapons";

const player = Players.LocalPlayer;

@Controller()
export class WeaponCustomizationController implements OnStart, OnRender {
	character = (player.Character || player.CharacterAdded.Wait()[0]) as CharacterRigR15;
	maid = new Maid();
	dragging = false;

	lastMousePosition?: Vector2;
	weapon?: FirearmInstance;
	attachments: BasePart[] = [];

	onStart() {
		clientStore.subscribe(selectCustomizationIsOpen, () => {
			clientStore.resetWeaponPreview();
		});
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

	cleanPreview() {
		clientStore.resetWeaponPreview();
		clientStore.setSelectedWeapon(undefined);
	}

	watchSelectedItem() {
		return clientStore.subscribe(selectSelectedWeapon, (newWeapon) => {
			clientStore.resetWeaponPreview();
			clientStore.clearModificationMounts();
			Workspace.CustomizationBox.Weapons.ClearAllChildren();

			if (newWeapon) {
				Log.Warn("Setting up viewport for weapon {@Weapon}", newWeapon);
				this.setupViewport(newWeapon);
			}
		});
	}

	watchAdditionalItem() {
		return clientStore.subscribe(selectModificationPreviews, (modifications) => {
			this.handleModificationPreviews(modifications);
		});
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
