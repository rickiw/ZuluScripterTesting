import { createProducer } from "@rbxts/reflex";
import { buttons } from "client/ui/library/menu/button-row";
import { Objective } from "shared/store/objectives";

type MenuPage = (typeof buttons)[number];

export interface MenuState {
	readonly menuOpen: boolean;
	readonly menuPage: MenuPage;
	readonly menuPanel?: BasePart;
	readonly selectedObjective?: Objective;
}

const initialState: MenuState = {
	menuOpen: false,
	menuPage: "Perks",
	menuPanel: undefined,
	selectedObjective: undefined,
};

export const menuSlice = createProducer(initialState, {
	setSelectedObjective: (state, objective: Objective) => ({
		...state,
		selectedObjective: objective,
	}),
	setMenuOpen: (state, menuOpen: boolean) => ({
		...state,
		menuOpen,
	}),
	setMenuPage: (state, menuPage: MenuPage) => ({
		...state,
		menuPage,
	}),
	setMenuPanel: (state, menuPanel: BasePart) => ({
		...state,
		menuPanel,
	}),
});
