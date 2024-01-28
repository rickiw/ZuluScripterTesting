import { FireMode } from "shared/types/combat/FirearmWeapon/FirearmLike";
import { FirearmMagazine } from "shared/types/combat/FirearmWeapon/FirearmMagazine";
import { WeaponState } from "shared/types/combat/Weapon";

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
