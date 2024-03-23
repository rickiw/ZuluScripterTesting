import { AnimationDict, SoundCache, SoundDict } from "shared/utils";
import { IModificationSave, WeaponLike } from ".";
import { FirearmProjectileLike } from "./projectile";

export type FireMode = "Automatic" | "Semi-Automatic" | "Single" | "Burst" | "Safety";

export interface BarrelConfig {
	velocity: number;
	chambered: FirearmProjectileLike;
	fireModes: FireMode[];
	rpm: number;

	burstCount: number;

	firePoint: Attachment;
	chamberPoint: Attachment;
	muzzlePoint: Attachment;
}

export interface MagazineConfig {
	capacity: number;
	holds: FirearmProjectileLike;
	magazine: BasePart;
}

export interface SightConfig {
	aimPoint: Attachment;
}

export type FirearmDataSave = {
	[K in WEAPON]: FirearmSave & { weaponName: K };
};

export function getWeaponEntry(weapon: WEAPON, weaponData: FirearmDataSave) {
	return weaponData[weapon];
}

export function getNewWeaponEntry(weapon: WEAPON, weaponData: FirearmDataSave, entry: FirearmSave) {
	const newWeaponData: FirearmDataSave = {
		...weaponData,
		[weapon]: entry,
	};
	return newWeaponData;
}

export interface FirearmSave {
	equipped: boolean;
	magazine: number;
	ammo: number;
	attachments: IModificationSave[];
}

export interface FirearmLike extends WeaponLike {
	Barrel: BarrelConfig;
	Magazine: MagazineConfig;
	Sight: SightConfig;
	animations: FirearmAnimations<number | string>;
}

export interface FirearmAnimations<T extends number | string | AnimationTrack | Animation> extends AnimationDict<T> {
	Idle: T;
	Reload: T;
	Aim: T;
	Fire: T;
}

export interface FirearmSounds<T extends number | string | Sound | SoundCache> extends SoundDict<T> {
	Fire: T;
	Reload: T;
	ChamberEmpty: T;
	AimIn: T;
	AimOut: T;
}
