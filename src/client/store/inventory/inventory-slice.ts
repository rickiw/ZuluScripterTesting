import { createProducer } from "@rbxts/reflex";
import { ReplicatedStorage } from "@rbxts/services";
import { BaseFirearm } from "client/components/BaseFirearm";
import { WeaponBase } from "shared/constants/weapons";

export interface InventoryState {
	readonly inventoryOpen: boolean;
	readonly activeWeapon: Tool | undefined;
	readonly inventoryItems: BaseFirearm<any, any>[];
	readonly allWeapons: WeaponBase[];
}

const initialState: InventoryState = {
	inventoryOpen: false,
	activeWeapon: undefined,
	inventoryItems: [],
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
	addInventoryItem: (state, item: BaseFirearm<any, any>) => ({
		...state,
		inventoryItems: [...state.inventoryItems, item],
	}),
	removeInventoryItem: (state, item: BaseFirearm<any, any>) => ({
		...state,
		inventoryItems: state.inventoryItems.filter((inventoryItem) => inventoryItem !== item),
	}),
});
