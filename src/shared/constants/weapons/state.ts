import { FireMode, FirearmMagazine, WeaponState } from ".";

export interface BaseFirearmState extends WeaponState {
	mode: FireMode;
	cooldown: boolean;
	reloading: boolean;
	reserve: number;
	holding: number;
}

export interface FirearmState extends Omit<BaseFirearmState, "holding"> {
	magazine: FirearmMagazine;
}

export function isFirearmState(weaponState: WeaponState): weaponState is FirearmState {
	return (
		"magazine" in weaponState &&
		"cooldown" in weaponState &&
		"mode" in weaponState &&
		"bullets" in weaponState &&
		"reloading" in weaponState
	);
}
