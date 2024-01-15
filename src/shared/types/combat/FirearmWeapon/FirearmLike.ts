import { FirearmAttachment } from "shared/types/combat/FirearmWeapon/FirearmAttachment";
import { FirearmProjectileLike } from "shared/types/combat/FirearmWeapon/FirearmProjectile";
import { WeaponLike } from "shared/types/combat/Weapon";

export interface BarrelConfig {
	velocity: number;
	chambered: FirearmProjectileLike;

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
}
