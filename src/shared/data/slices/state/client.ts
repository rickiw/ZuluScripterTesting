import { createProducer } from "@rbxts/reflex";

export interface ClientState {}

const initialState: ClientState = {};

export const clientSlice = createProducer(initialState, {});
