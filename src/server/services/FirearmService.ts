import { Components } from "@flamework/components";
import { Dependency, OnStart, Service } from "@flamework/core";
import Log from "@rbxts/log";
import Object from "@rbxts/object-utils";
import { CharacterRigR15 } from "@rbxts/promise-character";
import { CollectionService, ReplicatedStorage } from "@rbxts/services";
import { BaseFirearm, FirearmAttributes, FirearmInstance } from "server/components/combat/firearm/BaseFirearm";
import { defaultWeaponData } from "server/data";
import { Events, Functions } from "server/network";
import { serverStore } from "server/store";
import { selectPlayerSave } from "server/store/saves";
import { PlayerID } from "shared/constants/clans";
import { FirearmDataSave, FirearmSave, IModification, IModificationSave } from "shared/constants/weapons";
import { CharacterRemoving } from "./PlayerService";

@Service()
export class FirearmService implements OnStart, CharacterRemoving {
	mappedWeapons = new Map<Tool, BaseFirearm<FirearmAttributes, FirearmInstance>>();

	constructor() {}

	getPlayerWeaponData(playerId: PlayerID) {
		const state = serverStore.getState();
		const playerSave = selectPlayerSave(playerId)(state);
		assert(playerSave, "Player save not found | FirearmService->GetPlayerWeaponData");
		const weaponData = playerSave.weaponData;
		return weaponData ?? defaultWeaponData;
	}

	unloadWeapon(weapon: Tool) {
		this.mappedWeapons.delete(weapon);
	}

	onStart() {
		this.initRemotes();
	}

	initRemotes() {
		Events.UpdateFirearm.connect((player, weapon, modifications) => {
			this.updateAttachments(player, weapon, modifications);
		});

		Functions.EquipFirearm.setCallback((player, weapon) => {
			return this.equipFirearm(player, weapon);
		});

		Functions.FireFirearm.setCallback((player, weapon, mousePosition) => {
			const mappedWeapon = this.mappedWeapons.get(weapon);
			if (!mappedWeapon) {
				Log.Warn(
					"Player {@Player} tried to fire an unmapped weapon | FirearmService->FireFirearm",
					player.Name,
				);
				return false;
			}

			const wielder = mappedWeapon.wielder.get();
			if (player !== wielder || weapon !== mappedWeapon.instance || !mappedWeapon.equipped) {
				return false;
			}
			if (!mappedWeapon.canFire()) {
				if (mappedWeapon.state.magazine.holding === 0) {
					mappedWeapon.soundManager.play("ChamberEmpty");
				}
				return false;
			}
			const direction = mousePosition.sub(mappedWeapon.configuration.barrel.firePoint.WorldPosition).Unit;
			mappedWeapon.fire(direction);
			return true;
		});

		Events.UnequipFirearm.connect((player, weapon) => {
			const mappedWeapon = this.mappedWeapons.get(weapon);
			if (!mappedWeapon) {
				Log.Warn(
					"Player {@Player} tried to unequip an unmapped weapon | FirearmService->FireFirearm",
					player.Name,
				);
				return false;
			}

			if (weapon === mappedWeapon.instance && player === mappedWeapon.wielder.get()) {
				const state = serverStore.getState();
				const data = selectPlayerSave(player.UserId)(state);
				if (!data) {
					Log.Warn(
						"Player {@Player} doesn't have save data | FirearmService->PlayerDataRemoving",
						player.Name,
					);
					return;
				}
				const weaponData = data.weaponData;

				for (const key of Object.keys(weaponData)) {
					if (key === mappedWeapon.instance.Name) {
						const newWeaponData = this.getUpdatedWeaponData(weaponData, key, {
							reserve: mappedWeapon.state.reserve,
							magazine: mappedWeapon.state.magazine.holding,
							equipped: true,
						});

						serverStore.updatePlayerSave(player.UserId, { weaponData: newWeaponData });
					}
				}

				mappedWeapon.instance.Destroy();
			}
		});

		Events.ReloadFirearm.connect((player, weapon) => {
			const mappedWeapon = this.mappedWeapons.get(weapon);
			if (!mappedWeapon) {
				Log.Warn(
					"Player {@Player} tried to reload an unmapped weapon | FirearmService->FireFirearm",
					player.Name,
				);
				return false;
			}

			if (player === mappedWeapon.wielder.get() && weapon === mappedWeapon.instance && mappedWeapon.equipped) {
				Log.Warn("Reloading weapon | BaseFirearm->ReloadFirearm");
				mappedWeapon.reload();
			}
		});
	}

	equipFirearm(player: Player, weapon: Tool) {
		if (weapon.Parent !== ReplicatedStorage.Assets.Weapons) {
			Log.Warn("Player {@Player} equipped bad weapon, parent was {@Parent}", player.Name, weapon.Parent);
			return;
		}
		const backpack = player.FindFirstChildOfClass("Backpack")!;
		const weaponClone = weapon.Clone();
		weaponClone.Parent = backpack;
		CollectionService.AddTag(weaponClone, "baseFirearm");
		const weaponData = this.getPlayerWeaponData(player.UserId);

		const components = Dependency<Components>();
		const firearmClass = components.getComponent<BaseFirearm<any, any>>(weaponClone);
		const modifications = weaponData[weapon.Name as WEAPON].attachments ?? ([] as IModificationSave[]);

		if (!firearmClass) {
			Log.Warn(
				"Player {@Player}'s cloned {@Weapon} doesn't have firearm component | FirearmService->EquipFirearm",
				player.Name,
				weapon.Name,
			);
			return;
		}
		const [success, response] = Functions.LoadWeapon.invoke(player, weaponClone).await();
		if (!success || !response) {
			Log.Warn(
				"Failed to load weapon ({@Success}|{@Response}) | FirearmService->EquipFirearm",
				success,
				response,
			);
			weaponClone.Destroy();
			return;
		}
		this.mappedWeapons.set(weaponClone, firearmClass);
		firearmClass.wielder.set(player as never);
		firearmClass.load(player);
		firearmClass.updateState({
			reserve: weaponData[weapon.Name as WEAPON].reserve,
		});
		firearmClass.updateMagazineHolding(weaponData[weapon.Name as WEAPON].magazine);
		firearmClass.updateToolAttachmentsByName(weaponClone, modifications);
		return weaponClone;
	}

	serializeModifications(modifications: IModification[]) {
		const serialized: IModificationSave[] = [];
		modifications.forEach((mod) => {
			serialized.push({
				...mod,
				modification: mod.modification.Name,
			});
		});
		return serialized;
	}

	getUpdatedWeaponData<T extends WEAPON>(weaponData: FirearmDataSave, weaponName: T, update: Partial<FirearmSave>) {
		const newWeaponData: FirearmDataSave = {
			...weaponData,
			[weaponName]: {
				...weaponData[weaponName],
				...update,
			},
		};
		return newWeaponData;
	}

	updateAttachments(player: Player, weapon: Tool, modifications: IModification[]) {
		const state = serverStore.getState();
		const playerSave = selectPlayerSave(player.UserId)(state);
		if (!playerSave) {
			Log.Warn("Player save not found | updateAttachments");
			return;
		}
		const weaponData = this.getPlayerWeaponData(player.UserId);
		const newWeaponData = this.getUpdatedWeaponData(weaponData, weapon.Name as WEAPON, {
			attachments: this.serializeModifications(modifications),
		});

		serverStore.updatePlayerSave(player.UserId, { weaponData: newWeaponData });

		const backpack = player.FindFirstChildOfClass("Backpack")!;
		const character = player.Character as CharacterRigR15;

		const playerWeapon = character.FindFirstChild(weapon.Name) || backpack.FindFirstChild(weapon.Name);
		if (!playerWeapon) {
			Log.Warn(
				"Player {@Player} doesn't currently hold {@Weapon} | FirearmService->UpdateAttachments",
				player.Name,
				weapon.Name,
			);
			return;
		}

		const components = Dependency<Components>();
		const firearmClass = components.getComponent<BaseFirearm<any, any>>(playerWeapon);

		if (!firearmClass) {
			Log.Warn(
				"Player {@Player}'s {@Weapon} doesn't have firearm component | FirearmService->UpdateAttachments",
				player.Name,
				playerWeapon.Name,
			);
			return;
		}

		firearmClass.updateToolAttachments(playerWeapon as Tool, modifications);
	}

	characterRemoving(player: Player, character: CharacterRigR15) {
		const state = serverStore.getState();
		const data = selectPlayerSave(player.UserId)(state);
		if (!data) {
			Log.Warn("Player {@Player} doesn't have save data | FirearmService->PlayerDataRemoving", player.Name);
			return;
		}
		const weaponData = data.weaponData;
		const backpack = player.FindFirstChildOfClass("Backpack")!;
		if (!character || !backpack) {
			Log.Warn(
				"Player {@Player} doesn't have character or missing backpack | FirearmService->PlayerDataRemoving",
				player.Name,
			);
			return;
		}
		for (const key of Object.keys(weaponData)) {
			const playerWeapon = character.FindFirstChild(key) || backpack.FindFirstChild(key);
			if (!playerWeapon || !playerWeapon.IsA("Tool")) {
				return;
			}
			const components = Dependency<Components>();
			const firearmClass = components.getComponent<BaseFirearm<any, any>>(playerWeapon);
			if (!firearmClass) {
				Log.Warn(
					"Player {@Player}'s {@Weapon} doesn't have firearm component | FirearmService->PlayerDataRemoving",
					player.Name,
					playerWeapon.Name,
				);
				return;
			}
			const newWeaponData = this.getUpdatedWeaponData(weaponData, key, {
				reserve: firearmClass.state.reserve,
				magazine: firearmClass.state.magazine.holding,
				equipped: true,
			});
			serverStore.updatePlayerSave(player.UserId, { weaponData: newWeaponData });
		}
	}
}
