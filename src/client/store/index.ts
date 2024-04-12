import { UseProducerHook, UseSelectorHook, useProducer, useSelector } from "@rbxts/react-reflex";
import { InferState, combineProducers } from "@rbxts/reflex";
import { cameraSlice } from "client/store/camera";
import { customizationSlice } from "client/store/customization/customization-slice";
import { interactionSlice } from "client/store/interaction";
import { slices } from "shared/data";
import { characterSlice } from "./character";
import { menuSlice } from "./menu";
import { receiverMiddleware } from "./middleware/receiver";
import { operatingSystemSlice } from "./operating-system";
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
		camera: cameraSlice,
		customization: customizationSlice,
		operatingSystem: operatingSystemSlice,
	});
	clientStore.applyMiddleware(receiverMiddleware());
	return clientStore;
}

const clientStore = createStore();
export { clientStore };

export type ClientStore = typeof clientStore;
