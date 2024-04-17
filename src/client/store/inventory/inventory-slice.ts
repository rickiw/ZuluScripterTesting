import { createProducer } from "@rbxts/reflex";
import { ReplicatedStorage } from "@rbxts/services";
import { FIREARM_TYPE } from "shared/constants/firearm";
import { WeaponBase } from "shared/constants/weapons";

export interface ToolWithMeta {
	readonly tool: Tool;
	meta: {
		weaponType?: FIREARM_TYPE;
	};
}

export interface InventoryState {
	readonly inventoryOpen: boolean;
	readonly inventoryItems: ToolWithMeta[];
	readonly primaryWeapon: Tool | undefined;
	readonly secondaryWeapon: Tool | undefined;
	readonly equippedWeaponInfo: { weaponName: string; ammo: number; reserve: number } | undefined;
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
	primaryWeapon: undefined,
	secondaryWeapon: undefined,
	equippedWeaponInfo: undefined,
	hasKilledEnemy: false,
};

export const inventorySlice = createProducer(initialState, {
	setInventoryOpen: (state, inventoryOpen: boolean) => ({
		...state,
		inventoryOpen,
	}),
	setPrimaryWeapon: (state, primaryWeapon: Tool | undefined) => ({
		...state,
		primaryWeapon,
	}),
	setSecondaryWeapon: (state, secondaryWeapon: Tool | undefined) => ({
		...state,
		secondaryWeapon,
	}),
	setEquippedWeaponInfo: (
		state,
		equippedWeaponInfo: { weaponName: string; ammo: number; reserve: number } | undefined,
	) => ({
		...state,
		equippedWeaponInfo,
	}),
	addInventoryItem: (state, item: ToolWithMeta) => ({
		...state,
		inventoryItems: [...state.inventoryItems, item],
	}),
	removeInventoryItem: (state, item: ToolWithMeta) => ({
		...state,
		inventoryItems: state.inventoryItems.filter((inventoryItem) => inventoryItem !== item),
	}),
	setHasKilledEnemy: (state, hasKilledEnemy: boolean) => ({
		...state,
		hasKilledEnemy,
	}),
});
