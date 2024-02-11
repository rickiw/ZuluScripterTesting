import { Modding, OnStart, Service } from "@flamework/core";
import Log from "@rbxts/log";
import { ObjectiveInstance } from "server/components/objectives/BaseObjective";
import { serverStore } from "server/store";
import { PlayerID } from "shared/constants/clans";
import { objectives } from "shared/constants/objectives";
import { Objective, ObjectiveSave } from "shared/store/objectives";
import { PlayerProfile, selectPlayerSave } from "shared/store/saves";
import { PlayerDataLoaded } from "./DataService";

export interface OnObjectiveComplete {
	objectiveComplete(player: Player, objective: Objective): void;
}

export interface OnObjectiveReward {
	objectiveReward(player: Player, objective: Objective, reward: number): void;
}

@Service()
export class ObjectiveService implements OnStart, PlayerDataLoaded {
	private objectiveCompleteListeners = new Set<OnObjectiveComplete>();
	private objectiveRewardListeners = new Set<OnObjectiveReward>();

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

	onStart() {
		objectives.forEach((objective) => serverStore.addObjective(objective));

		Modding.onListenerAdded<OnObjectiveComplete>((object) => this.objectiveCompleteListeners.add(object));
		Modding.onListenerRemoved<OnObjectiveComplete>((object) => this.objectiveCompleteListeners.delete(object));
		Modding.onListenerAdded<OnObjectiveReward>((object) => this.objectiveRewardListeners.add(object));
		Modding.onListenerRemoved<OnObjectiveReward>((object) => this.objectiveRewardListeners.delete(object));
	}

	completeObjective(player: Player, objective: Objective) {
		Log.Warn("Objective complete");
		this.objectiveCompleteListeners.forEach((listener) => listener.objectiveComplete(player, objective));
		const objectiveReward = objective.reward;
		const credits = serverStore.getState(selectPlayerSave(player.UserId))?.credits;
		assert(credits !== undefined, "Player profile not found");
		let reward = 0;
		if (typeIs(objectiveReward[0], "number")) {
			reward = objectiveReward[0];
		} else {
			reward = math.random(objectiveReward[0][0], objectiveReward[0][1]);
		}
		Log.Warn("Rewarding {@Reward} credits", reward);
		serverStore.updatePlayerSave(player.UserId, {
			credits: credits + reward,
		});
		this.objectiveRewardListeners.forEach((listener) => listener.objectiveReward(player, objective, reward));
	}
}
