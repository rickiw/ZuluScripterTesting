import Object from "@rbxts/object-utils";
import { SharedState } from "..";

export const selectPlayerTeam = (player: Player) => (state: SharedState) => {
	return Object.keys(state.team.teams).find((team) => state.team.teams[team].members.includes(player));
};

export const selectTeams = (state: SharedState) => state.team.teams;
