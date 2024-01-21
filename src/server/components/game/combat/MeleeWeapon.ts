import { WeaponLike, WeaponType } from "shared/types/combat/Weapon";
import { AnimationDict } from "shared/utils/animation";
import { SoundDict } from "shared/utils/sound";
export interface MeleeLike extends WeaponLike {
	damage: number;
	critDamage: number;
}

export class MeleeWeapon implements MeleeLike {
	animations: AnimationDict<string | number>;
	critDamage: number;
	damage: number;
	name: string;
	tool: Tool;
	type: WeaponType;
	sounds: SoundDict<number | string>;

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
