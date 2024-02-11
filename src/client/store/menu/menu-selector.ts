import { RootState } from "..";

export const selectMenuPage = (state: RootState) => {
	return state.menu.menuPage;
};

export const selectMenuPanel = (state: RootState) => {
	return state.menu.menuPanel!;
};

export const selectMenuObjective = (state: RootState) => {
	return state.menu.selectedObjective;
};

export const selectMenuOpen = (state: RootState) => {
	return state.menu.menuOpen;
};
