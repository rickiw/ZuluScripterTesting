import { New } from "@rbxts/fusion";
import { Debris } from "@rbxts/services";
import { SoundOptions } from "shared/assets/sounds";
import { AnimationDict, ManagedSound } from "shared/utils";
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

export interface FirearmSounds {
	Fire: number;
	Reload: number;
	ChamberEmpty: number;
	AimIn: number;
	AimOut: number;
}

export class FirearmSoundManager<T extends FirearmSounds> {
	settings: SoundOptions = { lifetime: 10, volume: 1, parent: undefined, looped: false, speed: 1 };
	managedSounds: ManagedSound[] = [];
	sounds: T;
	parent: Instance;

	constructor(sounds: T, parent: Instance, settings?: SoundOptions) {
		this.sounds = sounds;
		this.parent = parent;
		this.settings = { ...this.settings, ...settings };
	}

	stopAll() {
		this.managedSounds.forEach((sound) => sound.sound.Stop());
	}

	play(name: keyof FirearmSounds, settings?: Partial<SoundOptions>) {
		const soundId = "rbxassetid://" + this.sounds[name];
		const finalSettings = { ...this.settings, ...settings };
		const sound = New("Sound")({
			Name: name,
			Parent: this.parent,
			SoundId: soundId,
			Volume: finalSettings.volume,
			Looped: finalSettings.looped,
			PlaybackSpeed: finalSettings.speed,
		});
		sound.Play();
		this.managedSounds.push({
			inUse: true,
			sound,
		});
		if (this.settings.lifetime) {
			Debris.AddItem(sound, this.settings.lifetime);
		}
	}
}
