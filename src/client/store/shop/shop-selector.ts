import { RootState } from "..";

export const selectGamePasses = (state: RootState) => {
	return state.shop.gamePasses;
};

export const selectDevProducts = (state: RootState) => {
	return state.shop.devProducts;
};

export const selectActiveShopItem = (state: RootState) => {
	return state.shop.selectedShopItem;
};
