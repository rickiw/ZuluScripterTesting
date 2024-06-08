import { RootState } from "..";

export const selectMenuPage = (state: RootState) => {
	return state.menu.menuPage;
};

export const selectMenuPanel = (state: RootState) => {
	return state.menu.menuPanel!;
};

export const selectSelectedObjective = (state: RootState) => {
	return state.menu.selectedObjective;
};

export const selectActiveObjective = (state: RootState) => {
	return state.menu.activeObjective;
};

export const selectActiveObservingObjective = (state: RootState) => {
	return state.menu.activeObservingObjective;
};

export const selectMenuOpen = (state: RootState) => {
	return state.menu.menuOpen;
};

export const selectPlayerSave = (state: RootState) => {
	return state.menu.playerSave;
};
