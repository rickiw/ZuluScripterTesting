import { AnimationDict } from "shared/utils";
import { FIREARM_TYPE } from "../firearm";
import { FirearmSounds } from "./firearm";

export type WeaponType = "Firearm" | "Melee";

export interface WeaponRecoil {
	intensity: number;
	increment: number;
	time: number;
}

export interface WeaponLike {
	name: string;
	recoil: WeaponRecoil;
	type: WeaponType;
	animations: AnimationDict<string | number>;
	sounds: FirearmSounds;
	tool: Tool;
}

export interface WeaponBase {
	baseTool: Tool;
	weaponType: FIREARM_TYPE;
}

export interface WeaponState {
	configuration: WeaponLike;
}
