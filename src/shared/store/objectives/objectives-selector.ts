import { SharedState } from "..";
import { TeamAbbreviation } from "../teams";

export const selectAllObjectives = (state: SharedState) => {
	return state.objectives.objectives;
};

export const selectObjective = (category: TeamAbbreviation) => {
	return (state: SharedState) => state.objectives.objectives.filter((objective) => objective.category === category);
};
