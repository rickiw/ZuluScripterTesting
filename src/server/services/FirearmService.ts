import { Components } from "@flamework/components";
import { Dependency, OnStart, Service } from "@flamework/core";
import Log from "@rbxts/log";
import Object from "@rbxts/object-utils";
import { CharacterRigR15 } from "@rbxts/promise-character";
import { CollectionService, ReplicatedStorage } from "@rbxts/services";
import { BaseFirearm } from "server/components/combat/firearm/BaseFirearm";
import { defaultWeaponData } from "server/data";
import { Events, Functions } from "server/network";
import { serverStore } from "server/store";
import { selectPlayerSave } from "server/store/saves";
import { PlayerID } from "shared/constants/clans";
import { FirearmDataSave, FirearmSave, IModification, IModificationSave } from "shared/constants/weapons";
import { CharacterRemoving } from "./PlayerService";

@Service()
export class FirearmService implements OnStart, CharacterRemoving {
	constructor() {}

	getPlayerWeaponData(playerId: PlayerID) {
		const state = serverStore.getState();
		const playerSave = selectPlayerSave(playerId)(state);
		assert(playerSave, "Player save not found | FirearmService->GetPlayerWeaponData");
		const weaponData = playerSave.weaponData;
		return weaponData ?? defaultWeaponData;
	}

	onStart() {
		Events.UpdateFirearm.connect((player, weapon, modifications) => {
			this.updateAttachments(player, weapon, modifications);
		});

		Functions.EquipFirearm.setCallback((player, weapon) => {
			return this.equipFirearm(player, weapon);
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
		firearmClass.updateState({
			reserve: weaponData[weapon.Name as WEAPON].ammo,
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
				ammo: firearmClass.state.reserve,
				magazine: firearmClass.state.magazine.holding,
				equipped: true,
			});
			serverStore.updatePlayerSave(player.UserId, { weaponData: newWeaponData });
		}
	}
}
