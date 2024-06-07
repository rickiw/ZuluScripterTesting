import { useSelector } from "@rbxts/react-reflex";
import { Players } from "@rbxts/services";
import { Events, Functions } from "client/network";
import { clientStore } from "client/store";
import { selectSelectedWeapon } from "client/store/customization";
import { selectInventoryItems } from "client/store/inventory";
import { WeaponBase } from "shared/constants/weapons";

const player = Players.LocalPlayer;

interface UseWeaponReturn {
	selectedWeapon: WeaponBase | undefined;
	holdingWeapon: (weapon: WeaponBase) => boolean;
	equipWeapon: (weapon: WeaponBase) => boolean;
	unequipWeapon: (weapon: Tool) => void;
}

export function useWeapon(): UseWeaponReturn {
	const selectedWeapon = useSelector(selectSelectedWeapon);

	const inventoryItems = useSelector(selectInventoryItems);
	const holdingWeapon = (weapon: WeaponBase) => {
		return inventoryItems.some((item) => item.tool.Name === weapon.baseTool.Name);
	};

	const equipWeapon = (weapon: WeaponBase) => {
		inventoryItems.forEach((item) => {
			if (item.meta.weaponType === weapon.weaponType) {
				Events.UnequipFirearm.fire(item.tool);
				clientStore.removeInventoryItem(item);
			}
		});

		const [success, clonedWeapon] = Functions.EquipFirearm.invoke(weapon.baseTool).await();
		if (!success) {
			throw `Failed to equip weapon ${weapon.baseTool.Name}, unsuccessful server response`;
		}

		if (!clonedWeapon) {
			clientStore.setSelectedWeapon(undefined);
			return false;
		}

		clientStore.addInventoryItem({
			tool: clonedWeapon,
			meta: {
				weaponType: weapon.weaponType,
			},
		});

		if (weapon.weaponType === "Primary") {
			clientStore.setPrimaryWeapon(clonedWeapon);
		} else if (weapon.weaponType === "Secondary") {
			clientStore.setSecondaryWeapon(clonedWeapon);
		}
		clientStore.setSelectedWeapon(weapon);

		return true;
	};

	const unequipWeapon = (weapon: Tool) => {
		const inventoryItem = inventoryItems.find((item) => item.tool.Name === weapon.Name);
		clientStore.setSelectedWeapon(undefined);
		if (!inventoryItem) {
			warn("could not find inventory item for", weapon.Name);
			return;
		}
		if (inventoryItem.meta.weaponType === "Primary") {
			clientStore.setPrimaryWeapon(undefined);
		} else if (inventoryItem.meta.weaponType === "Secondary") {
			clientStore.setSecondaryWeapon(undefined);
		}
		clientStore.removeInventoryItem(inventoryItem);
		Events.UnequipFirearm.fire(inventoryItem.tool);
	};

	return { selectedWeapon, holdingWeapon, equipWeapon, unequipWeapon };
}
