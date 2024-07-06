import { New } from "@rbxts/fusion";
import Log from "@rbxts/log";
import { CharacterRigR15 } from "@rbxts/promise-character";
import { ReplicatedStorage } from "@rbxts/services";
import { CharacterOptions } from "shared/constants/character";
import { DAMAGE_MULTIPLIERS } from "shared/constants/firearm";
import { FirearmProjectile, getGunDamage } from "shared/constants/weapons";

export const getCharacterFromHit = (hit: BasePart) => {
	const Model = hit.FindFirstAncestorOfClass("Model");
	if (!Model) {
		return;
	}
	const Humanoid = Model.FindFirstChildOfClass("Humanoid");
	if (Humanoid) {
		return Model as BaseCharacter;
	} else {
		return;
	}
};

export const getHumanoidFromHit = (hit: BasePart) => {
	const Char = getCharacterFromHit(hit);
	if (Char) {
		return Char.Humanoid;
	} else {
		return;
	}
};

export const isLimb = (hit: BasePart) => {
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

export function setCharacterProperties(character: CharacterRigR15, options: CharacterOptions) {
	character["Body Colors"].HeadColor3 = options.skinColor;
	character["Body Colors"].TorsoColor3 = options.skinColor;
	character["Body Colors"].LeftArmColor3 = options.skinColor;
	character["Body Colors"].LeftLegColor3 = options.skinColor;
	character["Body Colors"].RightArmColor3 = options.skinColor;
	character["Body Colors"].RightLegColor3 = options.skinColor;

	character.GetDescendants().forEach((instance) => {
		if (instance.IsA("Clothing") || instance.GetAttribute("Armor") !== undefined) {
			instance.Destroy();
		}
	});

	if (options.armor) {
		const armor = ReplicatedStorage.Assets.Armor.FindFirstChild(options.armor);
		if (!armor) {
			Log.Warn("No armor found for {@Armorname}", options.armor);
		} else {
			const armorClone = armor.Clone() as Model;
			armorClone.Parent = character;
			armorClone.SetAttribute("Armor", true);
			armorClone.PivotTo(
				character.HumanoidRootPart.CFrame.mul(CFrame.Angles(0, math.rad(-90), 0)).add(
					new Vector3(0, -0.25, 0.076),
				),
			);
		}
	}

	New("Shirt")({
		Parent: character,
		Name: "Shirt",
		ShirtTemplate: `rbxassetid://${tostring(options.outfit.shirt)}`,
	});
	New("Pants")({
		Parent: character,
		Name: "Pants",
		PantsTemplate: `rbxassetid://${tostring(options.outfit.pants)}`,
	});

	const face = character.Head.FindFirstChildOfClass("Decal");
	if (face) {
		face.Texture = `http://www.roblox.com/asset/?id=${options.face}`;
	}
}
