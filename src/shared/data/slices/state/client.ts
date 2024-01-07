import { createProducer } from "@rbxts/reflex";
import { BaseState } from "shared/state";

export interface ClientState extends Readonly<BaseState> {}

const initialState: ClientState = {
	debug: true,
};

export const clientSlice = createProducer(initialState, {
	setClientState: (state, data: Partial<ClientState>) => ({
		...state,
		...data,
	}),
});
