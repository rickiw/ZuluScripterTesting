import { UseProducerHook, UseSelectorHook, useProducer, useSelector } from "@rbxts/react-reflex";
import { InferState, combineProducers } from "@rbxts/reflex";
import { slices } from "shared/data";
import { characterSlice } from "./character";
import { interactionSlice } from "./interaction/interaction-slice";
import { menuSlice } from "./menu";
import { receiverMiddleware } from "./middleware/receiver";

type Store = typeof clientStore;

export type RootState = InferState<Store>;

export const useRootProducer: UseProducerHook<Store> = useProducer;
export const useRootSelector: UseSelectorHook<Store> = useSelector;

function createStore() {
	const clientStore = combineProducers({
		...slices,
		interaction: interactionSlice,
		menu: menuSlice,
		character: characterSlice,
	});
	clientStore.applyMiddleware(receiverMiddleware());
	return clientStore;
}

const clientStore = createStore();
export { clientStore };

export type ClientStore = typeof clientStore;
