import { createProducer } from "@rbxts/reflex";
import { buttons } from "client/ui/library/menu/button-row";
import { Objective } from "shared/store/objectives";
import { PlayerProfile } from "shared/utils";

type MenuPage = (typeof buttons)[number];

export interface MenuState {
	readonly playerSave: PlayerProfile | undefined;
	readonly menuOpen: boolean;
	readonly menuPage: MenuPage;
	readonly menuPanel?: BasePart;
	readonly selectedObjective?: Objective & { active: boolean };
	readonly activeObjective?: Objective & { active: boolean };
}

const initialState: MenuState = {
	menuOpen: false,
	menuPage: "Perks",
	menuPanel: undefined,
	selectedObjective: undefined,
	activeObjective: undefined,
	playerSave: undefined,
};

export const menuSlice = createProducer(initialState, {
	setSelectedObjective: (state, objective: Objective & { active: boolean }) => ({
		...state,
		selectedObjective: objective,
	}),
	setActiveObjective: (state, objective: Objective & { active: boolean }) => ({
		...state,
		activeObjective: objective,
	}),
	setMenuOpen: (state, menuOpen: boolean) => ({
		...state,
		menuOpen,
	}),
	setSave: (state, playerSave: PlayerProfile) => ({
		...state,
		playerSave,
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
