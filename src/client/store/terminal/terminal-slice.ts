import { createProducer } from "@rbxts/reflex";

export interface TerminalState {
	isOpen: boolean;
	accessLevel: number;
	currentDocument?: string;
	currentUser: string;
	sections: string[];
	activeSection: string;
}

const initialState: TerminalState = {
	isOpen: false,
	accessLevel: 4,
	currentDocument: undefined,
	currentUser: "root",
	activeSection: "home",
	sections: ["home", "document", "audio", "power"],
};

export const terminalSlice = createProducer(initialState, {
	setTerminalOpen: (state, isOpen: boolean) => ({ ...state, isOpen }),
	setCurrentUser: (state, currentUser: string) => ({ ...state, currentUser }),
	setAccessLevel: (state, accessLevel: number) => ({ ...state, accessLevel }),
	toggleTerminalOpen: (state) => ({ ...state, isOpen: !state.isOpen }),
	setCurrentDocument: (state, currentDocument: string) => ({ ...state, currentDocument }),
	setActiveSection: (state, activeSection: string) => ({ ...state, activeSection }),
});
