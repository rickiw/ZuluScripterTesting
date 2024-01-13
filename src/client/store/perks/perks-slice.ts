import Object from "@rbxts/object-utils";
import { createProducer } from "@rbxts/reflex";
import { PERKS, PerkInfo } from "shared/store/perks";

export interface PerkState {
	readonly allPerks: PerkInfo[];
	readonly selectedPerk?: PerkInfo;
}

const initialState: PerkState = {
	allPerks: Object.values(PERKS),
	selectedPerk: undefined,
};

export const perkSlice = createProducer(initialState, {
	setSelectedPerk: (state, perk: PerkInfo) => ({
		...state,
		selectedPerk: perk,
	}),
});
