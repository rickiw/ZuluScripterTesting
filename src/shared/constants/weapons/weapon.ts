import { AnimationDict, SoundDict } from "shared/utils";
import { FIREARM_TYPE } from "../firearm";

export type WeaponType = "Firearm" | "Melee";

export interface WeaponLike {
	name: string;
	type: WeaponType;
	animations: AnimationDict<string | number>;
	sounds: SoundDict<string | number>;
	tool: Tool;
}

export interface WeaponBase {
	baseTool: Tool;
	weaponType: FIREARM_TYPE;
}

export interface WeaponState {
	configuration: WeaponLike;
}
