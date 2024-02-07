import { UseProducerHook, UseSelectorHook, useProducer, useSelector } from "@rbxts/react-reflex";
import { InferState, combineProducers } from "@rbxts/reflex";
import { slices } from "shared/store";
import { cameraSlice } from "./camera";
import { characterSlice } from "./character";
import { interactionSlice } from "./interaction/interaction-slice";
import { menuSlice } from "./menu";
import { receiverMiddleware } from "./middleware/receiver";
import { perkSlice } from "./perks";
import { shopSlice } from "./shop";

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
		shop: shopSlice,
		perks: perkSlice,
		camera: cameraSlice,
	});
	clientStore.applyMiddleware(receiverMiddleware());
	return clientStore;
}

const clientStore = createStore();
export { clientStore };

export type ClientStore = typeof clientStore;
