import { FireMode, FirearmMagazine, WeaponState } from ".";

export interface FirearmState extends WeaponState {
	magazine: FirearmMagazine;
	bullets: number;

	mode: FireMode;

	cooldown: boolean;
	reloading: boolean;
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
