import { createProducer } from "@rbxts/reflex";
import { InteractionProps } from "client/ui/library/interaction/interaction";
import { BaseInteraction } from "shared/components/BaseInteraction";

export interface Interaction extends Readonly<InteractionProps> {
	readonly interactionComponent: BaseInteraction<any, any>;
}

export interface InteractionState {
	readonly interactions: readonly Interaction[];
	readonly modifications: readonly Modification[];
}

const initialState: InteractionState = {
	interactions: [],
	modifications: [],
};

export const interactionSlice = createProducer(initialState, {
	addInteraction: (state, interaction: Interaction) => ({
		...state,
		interactions: [interaction, ...state.interactions],
	}),
	addModification: (state, modification: Modification) => ({
		...state,
		modifications: [modification, ...state.modifications],
	}),
	removeInteraction: (state, id: string) => ({
		...state,
		interactions: state.interactions.filter((interaction) => interaction.id !== id),
	}),
	clearModifications: (state) => ({
		...state,
		modifications: [],
	}),
	setInteractionVisible: (state, id: string, visible: boolean) => ({
		...state,
		interactions: state.interactions.map((interaction) =>
			interaction.id === id ? { ...interaction, visible } : interaction,
		),
	}),
});
