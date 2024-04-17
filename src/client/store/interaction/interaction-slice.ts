import { createProducer } from "@rbxts/reflex";
import { InteractionProps } from "client/ui/components/interaction/interaction";
import { BaseInteraction } from "shared/components/BaseInteraction";

export interface Interaction extends Readonly<InteractionProps> {
	readonly interactionComponent: BaseInteraction<any, any>;
}

export interface InteractionState {
	readonly interactions: readonly Interaction[];
	readonly modificationMounts: readonly WeaponModificationMount[];
}

const initialState: InteractionState = {
	interactions: [],
	modificationMounts: [],
};

export const interactionSlice = createProducer(initialState, {
	addInteraction: (state, interaction: Interaction) => ({
		...state,
		interactions: [interaction, ...state.interactions],
	}),
	addModificationMount: (state, modificationMount: WeaponModificationMount) => ({
		...state,
		modificationMounts: [...state.modificationMounts, modificationMount],
	}),
	removeInteraction: (state, id: string) => ({
		...state,
		interactions: state.interactions.filter((interaction) => interaction.id !== id),
	}),
	clearModificationMounts: (state) => ({
		...state,
		modificationMounts: [],
	}),
	setInteractionVisible: (state, id: string, visible: boolean) => ({
		...state,
		interactions: state.interactions.map((interaction) =>
			interaction.id === id ? { ...interaction, visible } : interaction,
		),
	}),
});
