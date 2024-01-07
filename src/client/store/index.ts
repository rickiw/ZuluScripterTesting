import { UseProducerHook, UseSelectorHook, useProducer, useSelector } from "@rbxts/react-reflex";
import { InferState, combineProducers } from "@rbxts/reflex";
import { slices } from "shared/data";
import { interactionSlice } from "./interaction/interaction-slice";

type Store = typeof clientStore;

export type RootState = InferState<Store>;

export const useRootProducer: UseProducerHook<Store> = useProducer;
export const useRootSelector: UseSelectorHook<Store> = useSelector;

export const clientStore = combineProducers({
	...slices,
	interaction: interactionSlice,
});

export type ClientStore = typeof clientStore;
