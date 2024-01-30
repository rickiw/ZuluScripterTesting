import { FirearmAttachment } from "shared/types/combat/FirearmWeapon/FirearmAttachment";
import { FirearmProjectileLike } from "shared/types/combat/FirearmWeapon/FirearmProjectile";
import { WeaponLike } from "shared/types/combat/Weapon";
import { AnimationDict } from "shared/utils/animation";
import { SoundCache, SoundDict } from "shared/utils/sound";

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

export interface FirearmLike extends WeaponLike {
	Attachments: FirearmAttachment[];
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
