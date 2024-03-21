import { createProducer } from "@rbxts/reflex";
import { ReplicatedStorage } from "@rbxts/services";
import { WeaponBase } from "shared/constants/weapons";

export interface InventoryState {
	readonly inventoryOpen: boolean;
	readonly activeWeapon: Tool | undefined;
	readonly allWeapons: WeaponBase[];
}

const initialState: InventoryState = {
	inventoryOpen: false,
	activeWeapon: undefined,
	allWeapons: ReplicatedStorage.Assets.Weapons.GetChildren().map((weapon) => ({
		baseTool: weapon,
		weaponType: "Primary",
	})) as WeaponBase[],
};

export const inventorySlice = createProducer(initialState, {
	setInventoryOpen: (state, inventoryOpen: boolean) => ({
		...state,
		inventoryOpen,
	}),
	setActiveWeapon: (state, activeWeapon: Tool | undefined) => ({
		...state,
		activeWeapon,
	}),
});
