import { SharedState } from "..";
import { ObjectiveCategory } from "./objectives-slice";

export const selectAllObjectives = (state: SharedState) => {
	return state.objectives.objectives;
};

export const selectObjective = (category: ObjectiveCategory) => {
	return (state: SharedState) => state.objectives.objectives.filter((objective) => objective.category === category);
};
