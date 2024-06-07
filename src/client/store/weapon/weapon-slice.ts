import { createProducer } from "@rbxts/reflex";
import { BaseFirearm, FirearmAttributes, FirearmInstance } from "client/components/BaseFirearm";

export interface WeaponState {
	loadedWeapon?: BaseFirearm<FirearmAttributes, FirearmInstance>;
}

const initialState: WeaponState = {
	loadedWeapon: undefined,
};

export const weaponSlice = createProducer(initialState, {
	setLoadedWeapon: (state, loadedWeapon: BaseFirearm<FirearmAttributes, FirearmInstance> | undefined) => ({
		...state,
		loadedWeapon,
	}),
});
