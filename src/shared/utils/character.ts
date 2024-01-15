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
