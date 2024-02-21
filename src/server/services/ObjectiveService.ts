import { Modding, OnStart, Service } from "@flamework/core";
import Log from "@rbxts/log";
import { BaseObjective, ObjectiveAttributes } from "server/components/objectives/BaseObjective";
import { Events } from "server/network";
import { serverStore } from "server/store";
import { PlayerID } from "shared/constants/clans";
import { objectives } from "shared/constants/objectives";
import { Objective, ObjectiveID, ObjectiveSave } from "shared/store/objectives";
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
	private objectiveClasses = new Map<string, BaseObjective<any, any>>();

	private populateDefaultObjectiveCompletion(playerId: PlayerID) {
		const objectiveCompletion: ObjectiveSave[] = objectives.map((objective) => ({
			id: objective.id,
			completion: objective.completion || {},
		}));
		objectiveCompletion.forEach((objective) => {
			Log.Warn("Populated {Objective} {Completion}", objective.id, objective.completion);
		});
		Log.Warn("Populated");
		serverStore.updatePlayerSave(playerId, {
			objectiveCompletion,
		});
		return objectiveCompletion;
	}

	playerDataLoaded(player: Player, data: PlayerProfile) {
		Log.Warn("Checking");
		const objectiveCompletion = data.objectiveCompletion.isEmpty()
			? this.populateDefaultObjectiveCompletion(player.UserId)
			: data.objectiveCompletion;
	}

	registerObjective(objective: BaseObjective<ObjectiveAttributes, any>) {
		this.objectiveClasses.set(objective.attributes.name, objective);
	}

	onStart() {
		objectives.forEach((objective) => serverStore.addObjective(objective));

		Events.BeginObjective.connect((player, objective) => {
			const objectiveClass = this.objectiveClasses.get(objective);
			if (!objectiveClass) {
				Log.Warn("Objective class {@ObjectiveName} not found", objective);
				return;
			}
			objectiveClass.startObjective(player);
		});

		Modding.onListenerAdded<OnObjectiveComplete>((object) => this.objectiveCompleteListeners.add(object));
		Modding.onListenerRemoved<OnObjectiveComplete>((object) => this.objectiveCompleteListeners.delete(object));
		Modding.onListenerAdded<OnObjectiveReward>((object) => this.objectiveRewardListeners.add(object));
		Modding.onListenerRemoved<OnObjectiveReward>((object) => this.objectiveRewardListeners.delete(object));
	}

	getCompletion(player: Player, objectiveId: ObjectiveID) {
		const profile = serverStore.getState(selectPlayerSave(player.UserId));
		if (!profile) {
			Log.Warn("No profile found for player {@PlayerID}", player.Name);
			return {};
		}
		const objectiveCompletion = profile.objectiveCompletion.find((objective) => objective.id === objectiveId);
		if (!objectiveCompletion) {
			Log.Warn("Objective {@ObjectiveID} not found", objectiveId);
			return {};
		}
		return objectiveCompletion.completion;
	}

	saveCompletion(player: Player, objectiveId: ObjectiveID, completion: Record<string, unknown>) {
		const profile = serverStore.getState(selectPlayerSave(player.UserId));
		if (!profile) {
			Log.Warn("No profile found for player {@PlayerID}", player.Name);
			return;
		}
		const objectiveCompletion = profile.objectiveCompletion.map((objective) => {
			if (objective.id === objectiveId) {
				return {
					id: objective.id,
					completion,
				};
			}
			return objective;
		});
		serverStore.updatePlayerSave(player.UserId, {
			objectiveCompletion,
		});
	}

	completeObjective(player: Player, objective: Objective, completion: Record<string, unknown>) {
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
		const objectiveClass = this.objectiveClasses.get(objective.name);
		if (!objectiveClass) {
			Log.Warn("Objective class {@Objective} not found", objective.name);
			return;
		}
		this.saveCompletion(player, objective.id, completion);
		objectiveClass.stopObjective(player);
		this.objectiveRewardListeners.forEach((listener) => listener.objectiveReward(player, objective, reward));
	}
}
