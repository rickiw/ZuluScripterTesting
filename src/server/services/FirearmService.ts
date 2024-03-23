import { Components } from "@flamework/components";
import { Dependency, OnStart, Service } from "@flamework/core";
import Log from "@rbxts/log";
import { CharacterRigR15 } from "@rbxts/promise-character";
import { CollectionService, ReplicatedStorage } from "@rbxts/services";
import { BaseFirearm } from "server/components/combat/firearm/BaseFirearm";
import { Events } from "server/network";
import { serverStore } from "server/store";
import { selectPlayerSave } from "server/store/saves";
import { PlayerID } from "shared/constants/clans";
import { FirearmSave, IModification, IModificationSave } from "shared/constants/weapons";

export class WeaponData {
	weaponData: Map<string, FirearmSave>;

	constructor(weaponData: readonly FirearmSave[]) {
		this.weaponData = new Map(weaponData.map((data) => [data.weaponName, data]));
	}

	toWeaponData() {
		const firearmSave: FirearmSave[] = [];
		this.weaponData.forEach((value) => {
			firearmSave.push(value);
		});
		return firearmSave;
	}
}

@Service()
export class FirearmService implements OnStart {
	constructor() {}

	getPlayerWeaponData(playerId: PlayerID) {
		const state = serverStore.getState();
		const playerSave = selectPlayerSave(playerId)(state);
		assert(playerSave, "Couldn't find player save | FirearmService->GetPlayerWeaponData");
		return playerSave.weaponData
			? new WeaponData(playerSave.weaponData).weaponData
			: new Map<string, FirearmSave>();
	}

	onStart() {
		Events.UpdateFirearm.connect((player, weapon, modifications) => {
			this.updateAttachments(player, weapon, modifications);
		});

		Events.EquipFirearm.connect((player, weapon) => {
			this.equipFirearm(player, weapon);
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
		const modifications = weaponData.get(weapon.Name)?.attachments ?? ([] as IModificationSave[]);

		if (!firearmClass) {
			Log.Warn(
				"Player {@Player}'s cloned {@Weapon} doesn't have firearm component | FirearmService->EquipFirearm",
				player.Name,
				weapon.Name,
			);
			return;
		}
		firearmClass.updateToolAttachmentsByName(weaponClone, modifications);
	}

	updateWeaponData(playerId: PlayerID, key: string, update: FirearmSave) {
		const newWeaponData: FirearmSave[] = [];
		const state = serverStore.getState();
		const playerSave = selectPlayerSave(playerId)(state);
		if (!playerSave) {
			Log.Warn("Player save not found | BaseFirearm->updateWeaponData");
			return;
		}
		const weaponData = this.getPlayerWeaponData(playerId);
		weaponData.forEach((value, k) => {
			if (k === key) {
				Log.Warn("Found {@Weapon}, updating with {@Update}", key, update);
				newWeaponData.push(update);
			} else {
				Log.Warn("Not updating {@Key}, setting to normal value {@Value}", k, value);
				newWeaponData.push(value);
			}
		});
		Log.Warn("New Weapon Data Size: {@Size}", newWeaponData.size());
		serverStore.updatePlayerSave(playerId, { weaponData: newWeaponData });
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

	updateAttachments(player: Player, weapon: Tool, modifications: IModification[]) {
		const state = serverStore.getState();
		const playerSave = selectPlayerSave(player.UserId)(state);
		if (!playerSave) {
			Log.Warn("Player save not found | updateAttachments");
			return;
		}
		const weaponData = this.getPlayerWeaponData(player.UserId);
		const newWeaponData: FirearmSave[] = [];
		weaponData.forEach((value, key) => {
			if (key === weapon.Name) {
				newWeaponData.push({
					...value,
					attachments: this.serializeModifications(modifications),
				});
			} else {
				newWeaponData.push(value);
			}
		});
		serverStore.updatePlayerSave(player.UserId, { weaponData: newWeaponData });
		Log.Warn(
			"Updated attachments for {@Player}'s {@Weapon} {@Data} | FirearmService->UpdateAttachments",
			player.Name,
			weapon.Name,
			newWeaponData,
		);

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

		Log.Warn(
			"Player {@Player} has {@Weapon} in inventory | BaseFirearm->UpdateToolAttachments",
			player.Name,
			weapon.Name,
		);
		firearmClass.updateToolAttachments(playerWeapon as Tool, modifications);
	}
}
