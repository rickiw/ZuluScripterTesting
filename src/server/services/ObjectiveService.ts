import { Service } from "@flamework/core";
import { ObjectiveInstance } from "server/components/objectives/BaseObjective";
import { objectives } from "shared/constants/objectives";
import { PlayerProfile } from "shared/store/saves";
import { PlayerDataLoaded } from "./DataService";

@Service()
export class ObjectiveService implements PlayerDataLoaded {
	private populateDefaultObjectiveCompletion(playerProfile: PlayerProfile) {
		const defaultObjectiveCompletion = objectives.reduce(
			(acc, objective) => {
				acc[objective.id] = {
					completion: {},
				};
				return acc;
			},
			{} as Record<number, { completion: Record<string, boolean> }>,
		);
		return {
			...playerProfile,
			objectiveCompletion: defaultObjectiveCompletion,
		};
	}

	playerDataLoaded(player: Player, data: PlayerProfile) {
		const objectiveCompletion = data.objectiveCompletion;
		if (objectiveCompletion[999]) this.populateDefaultObjectiveCompletion(data);
	}

	registerObjective(objective: ObjectiveInstance) {}
}
