import { createProducer } from "@rbxts/reflex";

export interface ShopItem {
	readonly title: string;
	readonly description: string;
	readonly price: number;
	readonly image: string;
	readonly id: number;
}

export interface GamePass extends ShopItem {
	readonly type: "gamepass";
	readonly owned: boolean;
}

export interface DevProduct extends ShopItem {
	readonly type: "devproduct";
}

export interface ShopState {
	readonly gamePasses: readonly GamePass[];
	readonly devProducts: readonly DevProduct[];
}

const initialState: ShopState = {
	gamePasses: [],
	devProducts: [],
};

export const shopSlice = createProducer(initialState, {
	addGamePass: (state, gamePass: GamePass) => ({
		...state,
		gamePasses: [gamePass, ...state.gamePasses],
	}),
	addDevProduct: (state, devProduct: DevProduct) => ({
		...state,
		devProducts: [devProduct, ...state.devProducts],
	}),
});
