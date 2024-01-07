import { createProducer } from "@rbxts/reflex";
import { ClientState as IClientState } from "shared/clientState";

export interface ClientState extends Readonly<IClientState> {}

const initialState: ClientState = {
	debug: true,
	entityIdMap: new Map(),
	playerId: undefined,
};

export const clientSlice = createProducer(initialState, {
	setClientState: (state, data: Partial<ClientState>) => ({
		...state,
		...data,
	}),
});
