import { Component, Components } from "@flamework/components";
import { Dependency, OnStart } from "@flamework/core";
import Log from "@rbxts/log";
import Maid from "@rbxts/maid";
import { Players } from "@rbxts/services";
import { ObjectiveService } from "server/services/ObjectiveService";
import { PlayerRemoving } from "server/services/PlayerService";
import { On1SecondInterval } from "server/services/TickService";
import { BasePresence, OnPresence } from "shared/components/BasePresence";
import { PlayerID } from "shared/constants/clans";
import { BaseObjective, ObjectiveAttributes, ObjectiveInstance } from "./BaseObjective";

interface GuardObjectiveAttributes extends ObjectiveAttributes {
	goal: number;
}

interface GuardObjectiveInstance extends ObjectiveInstance {
	WatchArea: BasePart;
}

@Component({
	tag: "guardObjective",
})
export class GuardObjective<A extends GuardObjectiveAttributes, I extends GuardObjectiveInstance>
	extends BaseObjective<A, I>
	implements OnStart, OnPresence, PlayerRemoving, On1SecondInterval
{
	presenceComponents: BasePresence<any, any>[] = [];
	inZone: Set<PlayerID> = new Set();
	maid = new Maid();

	constructor(protected objectiveService: ObjectiveService) {
		super(objectiveService);
	}

	onStart() {
		const components = Dependency<Components>();
		if (!this.instance.WatchArea || !this.instance.WatchArea.HasTag("basePresence")) {
			Log.Error("GuardObjective must have a WatchArea");
			return;
		}

		const presenceComponent = components.getComponent<BasePresence<any, any>>(this.instance.WatchArea);
		if (!presenceComponent) {
			Log.Error("GuardObjective must have a WatchArea with a basePresence component");
			return;
		}

		this.presenceComponents.push(presenceComponent);
		this.maid.GiveTask(
			presenceComponent.presenceBegin.Connect((player) => {
				if (this.isDoingObjective(player)) {
					this.areaEnter(player);
				}
			}),
		);
		this.maid.GiveTask(
			presenceComponent.presenceEnd.Connect((player) => {
				if (this.isDoingObjective(player)) {
					this.areaExit(player);
				}
			}),
		);
	}

	areaEnter(player: Player) {
		this.inZone.add(player.UserId);
		this.beacon.Transparency = 0.3;
	}

	areaExit(player: Player) {
		this.inZone.delete(player.UserId);
		this.beacon.Transparency = 1;
	}

	playerRemoving(player: Player) {
		this.inZone.delete(player.UserId);
	}

	on1SecondInterval() {
		this.inZone.forEach((userId) => {
			const player = Players.GetPlayerByUserId(userId)!;
			assert(player, "Player not found");

			const completion = this.objectiveService.getCompletion(player, this.objectiveId);
			const completed = completion.completed ? (completion.completed as boolean) : false;
			const timeWatched = completion.timeWatched ? (completion.timeWatched as number) : 0;
			if (completed && timeWatched >= this.attributes.goal) {
				return;
			}
			if (timeWatched >= this.attributes.goal) {
				this.objectiveService.completeObjective(player, this.objective, {
					completed: true,
					timeWatched: this.attributes.goal,
				});
				return;
			}

			this.objectiveService.saveCompletion(player, this.objectiveId, {
				completed: false,
				timeWatched: timeWatched + 1,
			});
		});
	}
}
