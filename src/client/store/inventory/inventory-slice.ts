import { createProducer } from "@rbxts/reflex";
import { ReplicatedStorage } from "@rbxts/services";
import { WeaponBase } from "shared/constants/weapons";

export interface InventoryState {
	readonly inventoryOpen: boolean;
	readonly inventoryItems: Tool[];
	readonly allWeapons: WeaponBase[];
	readonly hasKilledEnemy: boolean;
}

const initialState: InventoryState = {
	inventoryOpen: false,
	inventoryItems: [],
	allWeapons: ReplicatedStorage.Assets.Weapons.GetChildren().map((weapon) => ({
		baseTool: weapon,
		weaponType: "Primary",
	})) as WeaponBase[],
	hasKilledEnemy: false,
};

export const inventorySlice = createProducer(initialState, {
	setInventoryOpen: (state, inventoryOpen: boolean) => ({
		...state,
		inventoryOpen,
	}),
	addInventoryItem: (state, item: Tool) => ({
		...state,
		inventoryItems: [...state.inventoryItems, item],
	}),
	removeInventoryItem: (state, item: Tool) => ({
		...state,
		inventoryItems: state.inventoryItems.filter((inventoryItem) => inventoryItem !== item),
	}),
	setHasKilledEnemy: (state, hasKilledEnemy: boolean) => ({
		...state,
		hasKilledEnemy,
	}),
});
