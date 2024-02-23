import { InferState, combineProducers } from "@rbxts/reflex";
import { slices } from "shared/store";
import { clanSlice } from "./clan";
import { broadcasterMiddleware } from "./middleware/broadcaster";
import { playerSaveSlice } from "./saves";

type Store = typeof serverStore;

export type RootState = InferState<Store>;

function createStore() {
	const store = combineProducers({
		...slices,
		clans: clanSlice,
		saves: playerSaveSlice,
	});
	store.applyMiddleware(broadcasterMiddleware());
	return store;
}

const serverStore = createStore();
export { serverStore };
