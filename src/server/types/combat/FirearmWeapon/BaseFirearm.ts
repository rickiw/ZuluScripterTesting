import FastCast, { Caster, FastCastBehavior } from "@rbxts/fastcast";
import { Workspace } from "@rbxts/services";
import { BULLET_PROVIDER } from "shared/constants/firearm";
import { GlobalFunctions } from "shared/network";
import { AnimationDict, AnimationUtil } from "shared/types/animation/AnimationUtil";
import { FirearmAttachment } from "shared/types/combat/FirearmWeapon/FirearmAttachment";
import { BarrelConfig, FirearmLike, MagazineConfig, SightConfig } from "shared/types/combat/FirearmWeapon/FirearmLike";
import { WeaponType } from "shared/types/combat/Weapon";
import { PlayerCharacterR15 } from "../../../../CharacterTypes";

// will make AutomaticFirearm, ShotgunFirearm, BoltActionFirearm, etc
export class BaseFirearm implements FirearmLike {
	Attachments: FirearmAttachment[];
	Barrel: BarrelConfig;
	Magazine: MagazineConfig;
	Sight: SightConfig;
	animations: AnimationDict<string | number>;
	name: string;
	type: WeaponType;

	tool: Tool;
	wielder: Player;
	char: PlayerCharacterR15 | undefined;
	loadedAnimations!: AnimationDict<AnimationTrack> | undefined;

	caster: Caster;
	behaviour!: FastCastBehavior;

	net = GlobalFunctions.createServer({});

	constructor(public configuration: FirearmLike) {
		this.Attachments = this.configuration.Attachments;
		this.Barrel = this.configuration.Barrel;
		this.Magazine = this.configuration.Magazine;
		this.Sight = this.configuration.Sight;
		this.animations = this.configuration.animations;
		this.name = this.configuration.name;
		this.type = this.configuration.type;
		this.tool = this.configuration.tool;
		this.wielder = this.configuration.wielder;

		this.caster = new FastCast();

		this.char = this.wielder.Character as PlayerCharacterR15;
		this.loadAnimations();
		this.initBehaviour();
	}

	isAbleToFire() {
		return this.tool.Parent === this.char;
	}

	initBehaviour() {
		if (!this.char) return;
		const params = new RaycastParams();
		params.FilterDescendantsInstances = [this.char, this.tool];
		params.FilterType = Enum.RaycastFilterType.Exclude;

		this.behaviour = FastCast.newBehavior();
		this.behaviour.RaycastParams = params;
		this.behaviour.CosmeticBulletProvider = BULLET_PROVIDER;
		this.behaviour.Acceleration = new Vector3(0, -Workspace.Gravity, 0);
	}

	loadAnimations() {
		if (!this.char) return;
		this.loadedAnimations = AnimationUtil.convertDictionaryToTracks(this.animations, this.char.Humanoid);
	}

	getVelocity(): number {
		return this.Barrel.velocity;
	}

	fire(direction: Vector3) {
		if (!this.isAbleToFire()) return;
		this.caster.Fire(this.Barrel.firePoint.Position, direction, direction.mul(this.getVelocity()));
	}

	onHit(result: RaycastResult, velocity: Vector3) {}
}
