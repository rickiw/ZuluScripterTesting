import { InferState, combineProducers } from "@rbxts/reflex";
import { slices } from "shared/data";
import { broadcasterMiddleware } from "./middleware/broadcaster";

type Store = typeof store;

export type RootState = InferState<Store>;

function createStore() {
	const store = combineProducers({
		...slices,
	});
	store.applyMiddleware(broadcasterMiddleware());
	return store;
}

const store = createStore();
export { store };
