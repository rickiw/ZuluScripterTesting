import { SharedState } from "..";

export const selectAlive = (player: Player) => (state: SharedState) => {
	return state.players.players.find((p) => p.player === player)?.alive ?? false;
};

export const selectAllPlayers = (state: SharedState) => {
	return state.players.players;
};

export const selectPlayer = (player: Player) => (state: SharedState) => {
	return state.players.players.find((p) => p.player === player);
};
