import { RootState } from "..";

export const selectOperatingSystemOpen = (state: RootState) => {
	return state.operatingSystem.Open;
};

export const selectOperatingSystemCurrentFrame = (state: RootState) => {
	return state.operatingSystem.ActivePage;
};
