import { RootState } from "..";

export const selectTerminal = (state: RootState) => state.terminal;
export const selectTerminalIsOpen = (state: RootState) => state.terminal.isOpen;
export const selectActiveSection = (state: RootState) => state.terminal.activeSection;
export const selectTerminalSections = (state: RootState) => state.terminal.sections;
export const selectActiveSectionIndex = (state: RootState) =>
	state.terminal.sections.indexOf(state.terminal.activeSection) + 1;
export const selectCurrentUser = (state: RootState) => state.terminal.currentUser;
export const selectAccessLevel = (state: RootState) => state.terminal.accessLevel;
export const selectCurrentDocument = (state: RootState) => state.terminal.currentDocument;
export const selectPlayerList = (state: RootState) => state.terminal.playerList;
