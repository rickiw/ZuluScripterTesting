import { FirearmMagazine, WeaponState } from ".";

export interface FirearmState extends WeaponState {
	magazine: FirearmMagazine;
	cooldown: boolean;

	reloading: boolean;
}
