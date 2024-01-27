import { AnimationDict, SoundDict } from "shared/utils";

export type WeaponType = "Firearm" | "Melee";

export interface WeaponLike {
	name: string;
	type: WeaponType;
	animations: AnimationDict<string | number>;
	sounds: SoundDict<string | number>;
	tool: Tool;
}

export interface WeaponState {
	configuration: WeaponLike;
}
