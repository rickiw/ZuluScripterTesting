import { AnimationDict } from "shared/types/animation/AnimationUtil";
import { WeaponLike, WeaponType } from "shared/types/combat/Weapon";

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
	wielder: Player;

	constructor(props: MeleeLike) {
		this.animations = props.animations;
		this.critDamage = props.critDamage;
		this.damage = props.damage;
		this.name = props.name;
		this.tool = props.tool;
		this.type = props.type;
		this.wielder = props.wielder;
	}
}
