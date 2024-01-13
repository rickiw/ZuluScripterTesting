import { createProducer } from "@rbxts/reflex";
import { InteractionProps } from "client/ui/library/interaction/interaction";
import { BaseInteraction } from "shared/components/BaseInteraction";

export interface InteractionState {
	readonly interactions: readonly Interaction[];
}

export interface Interaction extends Readonly<InteractionProps> {
	readonly interactionComponent: BaseInteraction<any, any>;
}

const initialState: InteractionState = {
	interactions: [],
};

export const interactionSlice = createProducer(initialState, {
	addInteraction: (state, interaction: Interaction) => ({
		...state,
		interactions: [interaction, ...state.interactions],
	}),
	removeInteraction: (state, id: string) => ({
		...state,
		interactions: state.interactions.filter((interaction) => interaction.id !== id),
	}),
	setInteractionVisible: (state, id: string, visible: boolean) => ({
		...state,
		interactions: state.interactions.map((interaction) =>
			interaction.id === id ? { ...interaction, visible } : interaction,
		),
	}),
});
