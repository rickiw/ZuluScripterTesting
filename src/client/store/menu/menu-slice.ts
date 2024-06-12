import { createProducer } from "@rbxts/reflex";
import { buttons } from "client/ui/components/menu/menu-button-row";
import { Objective } from "shared/store/objectives";
import { PlayerProfile } from "shared/utils";

type MenuPage = (typeof buttons)[number];

export interface MenuState {
	readonly playerSave: PlayerProfile | undefined;
	readonly menuOpen: boolean;
	readonly menuPage: MenuPage;
	readonly menuPanel: BasePart | undefined;
	readonly selectedObjective: (Objective & { active: boolean }) | undefined;
	readonly activeObservingObjective: Objective | undefined;
	readonly activeObjective: Objective | undefined;
}

const initialState: MenuState = {
	menuOpen: false,
	menuPage: "Objectives",
	menuPanel: undefined,
	selectedObjective: undefined,
	activeObservingObjective: undefined,
	activeObjective: undefined,
	playerSave: undefined,
};

export const menuSlice = createProducer(initialState, {
	setSelectedObjective: (state, objective: Objective & { active: boolean }) => ({
		...state,
		selectedObjective: objective,
	}),
	setActiveObjective: (state, objective: Objective | undefined) => ({
		...state,
		activeObjective: objective,
	}),
	setActiveObservingObjective: (state, objective: Objective | undefined) => ({
		...state,
		activeObservingObjective: objective,
	}),
	stopActiveObjective: (state) => ({
		...state,
		activeObjective: undefined,
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
