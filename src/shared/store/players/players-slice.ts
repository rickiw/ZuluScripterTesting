import { createProducer } from "@rbxts/reflex";

export interface PlayerState {
	player: Player;
	alive: boolean;
}

export interface PlayersState {
	readonly players: PlayerState[];
}

const initialState: PlayersState = {
	players: [],
};

export const playersSlice = createProducer(initialState, {
	addPlayer: (state, player: PlayerState) => ({
		...state,
		players: [...state.players, player],
	}),
	removePlayer: (state, player: Player) => ({
		...state,
		players: state.players.filter((p) => p.player !== player),
	}),
	setPlayerAlive: (state, { player, alive }: { player: Player; alive: boolean }) => ({
		...state,
		players: state.players.map((p) => (p.player === player ? { ...p, alive } : p)),
	}),
});
