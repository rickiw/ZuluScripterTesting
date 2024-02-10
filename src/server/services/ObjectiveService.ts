import { Service } from "@flamework/core";
import { ObjectiveInstance } from "server/components/objectives/BaseObjective";
import { serverStore } from "server/store";
import { PlayerID } from "shared/constants/clans";
import { objectives } from "shared/constants/objectives";
import { ObjectiveSave } from "shared/store/objectives";
import { PlayerProfile } from "shared/store/saves";
import { PlayerDataLoaded } from "./DataService";

@Service()
export class ObjectiveService implements PlayerDataLoaded {
	private populateDefaultObjectiveCompletion(playerId: PlayerID) {
		const objectiveCompletion: ObjectiveSave[] = objectives.map((objective) => ({
			id: objective.id,
			completion: {},
		}));
		serverStore.updatePlayerSave(playerId, {
			objectiveCompletion,
		});
		return objectiveCompletion;
	}

	playerDataLoaded(player: Player, data: PlayerProfile) {
		const objectiveCompletion = data.objectiveCompletion.isEmpty()
			? this.populateDefaultObjectiveCompletion(player.UserId)
			: data.objectiveCompletion;
	}

	registerObjective(objective: ObjectiveInstance) {}
}
