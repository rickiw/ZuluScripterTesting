import { createSelector } from "@rbxts/reflex";
import { RootState } from "..";

export const selectInteractions = (state: RootState) => {
	return state.interaction.interactions;
};

export const selectModifications = (state: RootState) => {
	return state.interaction.modifications;
};

export const selectInteractionsVisible = (state: RootState) => {
	return state.interaction.interactions.filter((interaction) => interaction.visible);
};

export const selectInteractionIndex = (id: string) => {
	return createSelector(selectInteractionsVisible, (interactions) => {
		return interactions.findIndex((interaction) => interaction.id === id);
	});
};

export const selectInteractionIdByPrompt = (prompt: ProximityPrompt) => {
	return createSelector(selectInteractionsVisible, (interactions) => {
		const interaction = interactions.find((interaction) => interaction.prompt === prompt);
		if (interaction) return interaction.id;
		return false;
	});
};
