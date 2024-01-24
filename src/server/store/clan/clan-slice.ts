import { createProducer } from "@rbxts/reflex";
import { Clan } from "shared/constants/clans";

export interface ClanState {
	readonly clans: Clan[];
}

const initialState: ClanState = {
	clans: [],
};

export const clanSlice = createProducer(initialState, {
	setClans: (state, clans: Clan[]) => ({
		...state,
		clans,
	}),
	setClanFunds: (state, clanId: number, amount: number) => {
		const clan = state.clans.find((clan) => clan.groupId === clanId);
		if (!clan) return state;
		return {
			...state,
			clans: state.clans.map((clan) => {
				if (clan.groupId === clanId) {
					return {
						...clan,
						bank: amount,
					};
				}
				return clan;
			}),
		};
	},
});
