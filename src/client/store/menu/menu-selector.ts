import { RootState } from "..";

export const selectMenuPage = (state: RootState) => {
	return state.menu.menuPage;
};

export const selectMenuPanel = (state: RootState) => {
	return state.menu.menuPanel!;
};
