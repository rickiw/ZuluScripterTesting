import { RootState } from "../index";

export const selectCharacter = (state: RootState) => state.character;
export const selectWalkspeedMultiplier = (state: RootState) => state.character.walkspeedMultiplier;

export const selectSprinting = ({ vitals, character }: RootState) => {
	return character.sprinting && vitals.stamina.value > 0;
};

export const selectExhausted = ({ vitals }: RootState) => {
	return vitals.stamina.value <= 0;
};

export const selectRecovering = ({ vitals }: RootState) => {
	return vitals.stamina.value > 0 && vitals.stamina.value < 1;
};
