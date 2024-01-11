import { createProducer } from "@rbxts/reflex";

export interface ShopItem {
	readonly title: string;
	readonly description: string;
	readonly type: string;
	readonly price: number;
	readonly color: Color3;
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
	readonly selectedShopItem?: ShopItem;
}

const initialState: ShopState = {
	gamePasses: [
		{
			id: 0,
			title: "GAMEPASS NAME",
			description: "TEST GAMEPASS DESCRIPTION",
			owned: false,
			price: 100,
			color: Color3.fromRGB(189, 38, 38),
			image: "rbxassetid://0",
			type: "gamepass",
		},
		{
			id: 0,
			title: "GAMEPASS NAME",
			description: "TEST GAMEPASS DESCRIPTION",
			owned: false,
			price: 150,
			color: Color3.fromRGB(36, 214, 33),
			image: "rbxassetid://0",
			type: "gamepass",
		},
		{
			id: 0,
			title: "GAMEPASS NAME",
			description: "TEST GAMEPASS DESCRIPTION",
			owned: false,
			price: 999,
			color: Color3.fromRGB(135, 5, 173),
			image: "rbxassetid://0",
			type: "gamepass",
		},
	],
	devProducts: [
		{
			id: 0,
			title: "GAMEPASS NAME",
			description: "TEST GAMEPASS DESCRIPTION",
			price: 100,
			color: Color3.fromRGB(222, 212, 31),
			image: "rbxassetid://0",
			type: "devproduct",
		},
		{
			id: 0,
			title: "GAMEPASS NAME",
			description: "TEST GAMEPASS DESCRIPTION",
			price: 100,
			color: Color3.fromRGB(36, 107, 209),
			image: "rbxassetid://0",
			type: "devproduct",
		},
	],
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
	setSelectedShopItem: (state, shopItem: ShopItem) => ({
		...state,
		selectedShopItem: shopItem,
	}),
});
