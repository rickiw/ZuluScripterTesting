import { DAMAGE_MULTIPLIERS } from "shared/constants/firearm";
import { FirearmProjectile, getGunDamage } from "shared/types/combat/FirearmWeapon";
import { BaseCharacter } from "../../CharacterTypes";

export const getCharacterFromHit = (hit: BasePart): BaseCharacter | undefined => {
	const Model = hit.FindFirstAncestorOfClass("Model");
	if (!Model) return;
	const Humanoid = Model.FindFirstChildOfClass("Humanoid");
	if (Humanoid) return Model as BaseCharacter;
	else return;
};

export const getHumanoidFromHit = (hit: BasePart): Humanoid | undefined => {
	const Char = getCharacterFromHit(hit);
	if (Char) return Char.Humanoid;
	else return;
};

export const isLimb = (hit: BasePart): boolean => {
	return getHumanoidFromHit(hit) !== undefined;
};

export type LimbType = "Arm" | "Leg" | "Torso" | "Head";

export const getLimbType = (limb: BasePart): LimbType =>
	limb.Name.match("Leg")[0]
		? "Leg"
		: limb.Name.match("Arm")[0]
			? "Arm"
			: limb.Name.match("Head")[0]
				? "Head"
				: "Torso";

export const getLimbProjectileDamage = (limb: BasePart, projectile: FirearmProjectile): number =>
	getGunDamage(projectile) * DAMAGE_MULTIPLIERS[getLimbType(limb)];
