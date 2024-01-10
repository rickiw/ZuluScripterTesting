import { RootState } from "../index";

export const selectCharacter = (state: RootState) => state.character;

export const selectStamina = (state: RootState) => state.character.stamina;

export const selectHealth = (state: RootState) => state.character.health;

export const selectSprinting = ({ character }: RootState) => {
	return character.sprinting && character.stamina > 0;
};

export const selectExhausted = ({ character }: RootState) => {
	return character.stamina <= 0;
};

export const selectRecovering = ({ character }: RootState) => {
	return character.stamina > 0 && character.stamina < 1;
};
