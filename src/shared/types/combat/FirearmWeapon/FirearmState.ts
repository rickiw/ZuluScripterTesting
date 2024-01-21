import { FirearmMagazine } from "shared/types/combat/FirearmWeapon/FirearmMagazine";
import { WeaponState } from "shared/types/combat/Weapon";

export interface FirearmState extends WeaponState {
	magazine: FirearmMagazine;
	cooldown: boolean;

	reloading: boolean;
}
