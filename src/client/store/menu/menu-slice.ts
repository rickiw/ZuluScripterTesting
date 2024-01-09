import { createProducer } from "@rbxts/reflex";
import { buttons } from "client/ui/library/menu/button-row";

type MenuPage = (typeof buttons)[number];

export interface MenuState {
	readonly menuPage: MenuPage;
	readonly menuPanel: BasePart | undefined;
}

const initialState: MenuState = {
	menuPage: "Clan",
	menuPanel: undefined,
};

export const menuSlice = createProducer(initialState, {
	setMenuPage: (state, menuPage: MenuPage) => ({
		...state,
		menuPage,
	}),
	setMenuPanel: (state, menuPanel: BasePart) => ({
		...state,
		menuPanel,
	}),
});
