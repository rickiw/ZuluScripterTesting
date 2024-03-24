import { WeaponLike, WeaponType } from "shared/constants/weapons/weapon";
import { AnimationDict, SoundDict } from "shared/utils";

export interface MeleeLike extends Omit<WeaponLike, "recoil" | "sounds"> {
	damage: number;
	critDamage: number;
	sounds: SoundDict;
}

export class MeleeWeapon implements MeleeLike {
	animations: AnimationDict<string | number>;
	critDamage: number;
	damage: number;
	name: string;
	tool: Tool;
	type: WeaponType;
	sounds: SoundDict;

	constructor(props: MeleeLike) {
		this.animations = props.animations;
		this.critDamage = props.critDamage;
		this.damage = props.damage;
		this.name = props.name;
		this.tool = props.tool;
		this.type = props.type;
		this.sounds = props.sounds;
	}
}
