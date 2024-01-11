import { createProducer } from "@rbxts/reflex";
import { buttons } from "client/ui/library/menu/button-row";

type MenuPage = (typeof buttons)[number];

export interface Objective {
	readonly title: string;
	readonly description: string;
	readonly importance: "low" | "medium" | "high";
	readonly completed: boolean;
}

export interface MenuState {
	readonly menuOpen: boolean;
	readonly menuPage: MenuPage;
	readonly menuPanel?: BasePart;
	readonly objectives: readonly Objective[];
	readonly selectedObjective?: Objective;
}

const initialState: MenuState = {
	menuOpen: false,
	menuPage: "Perks",
	menuPanel: undefined,
	objectives: [
		{
			title: "OBJECTIVE NAME",
			description: "XXX CREDITS",
			importance: "high",
			completed: false,
		},
		{
			title: "OBJECTIVE NAME 2",
			description: "XXX CREDITS",
			importance: "medium",
			completed: false,
		},
		{
			title: "OBJECTIVE NAME 3",
			description: "XXX CREDITS",
			importance: "low",
			completed: false,
		},
	],
	selectedObjective: undefined,
};

export const menuSlice = createProducer(initialState, {
	addObjective: (state, objective: Objective) => ({
		...state,
		objectives: [objective, ...state.objectives],
	}),
	removeObjective: (state, objective: Objective) => ({
		...state,
		objectives: state.objectives.filter((o) => o.title !== objective.title),
	}),
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
