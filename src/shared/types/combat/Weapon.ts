import { AnimationDict } from "shared/types/animation/AnimationUtil";

export type WeaponType = "Firearm" | "Melee";

export interface WeaponLike {
	name: string;
	type: WeaponType;
	animations: AnimationDict<string | number>;

	wielder: Player;
	tool: Tool;
}
