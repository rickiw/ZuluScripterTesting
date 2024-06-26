import { UseProducerHook, UseSelectorHook, useProducer, useSelector } from "@rbxts/react-reflex";
import { InferState, combineProducers } from "@rbxts/reflex";
import { slices } from "shared/store";
import { cameraSlice } from "./camera";
import { characterSlice } from "./character";
import { cookingSlice } from "./cooking";
import { customizationSlice } from "./customization";
import { interactionSlice } from "./interaction/interaction-slice";
import { inventorySlice } from "./inventory";
import { menuSlice } from "./menu";
import { receiverMiddleware } from "./middleware/receiver";
import { notificationSlice } from "./notifications/notification-slice";
import { perkSlice } from "./perks";
import { radioSlice } from "./radio";
import { shopSlice } from "./shop";
import { terminalSlice } from "./terminal";
import { vitalsSlice } from "./vitals";
import { weaponSlice } from "./weapon";

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
		customization: customizationSlice,
		vitals: vitalsSlice,
		inventory: inventorySlice,
		weapon: weaponSlice,
		cooking: cookingSlice,
		notifications: notificationSlice,
		terminal: terminalSlice,
		radio: radioSlice,
	});
	clientStore.applyMiddleware(receiverMiddleware());
	return clientStore;
}

const clientStore = createStore();
export { clientStore };

export type ClientStore = typeof clientStore;
