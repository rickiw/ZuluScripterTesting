import { SharedState } from "shared/data";

export const selectClientState = () => {
	return (state: SharedState) => {
		return state.client;
	};
};
