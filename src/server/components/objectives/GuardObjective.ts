import { Component, Components } from "@flamework/components";
import { Dependency, OnStart } from "@flamework/core";
import Log from "@rbxts/log";
import Maid from "@rbxts/maid";
import { ObjectiveService } from "server/services/ObjectiveService";
import { PlayerRemoving } from "server/services/PlayerService";
import { On1SecondInterval } from "server/services/TickService";
import { serverStore } from "server/store";
import { BasePresence, OnPresence } from "shared/components/BasePresence";
import { PlayerID } from "shared/constants/clans";
import { selectPlayerSave } from "shared/store/saves";
import { BaseObjective, ObjectiveAttributes, ObjectiveInstance } from "./BaseObjective";

interface GuardObjectiveAttributes extends ObjectiveAttributes {}

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
		this.maid.GiveTask(presenceComponent.presenceBegin.Connect((player: Player) => this.areaEnter(player)));
		this.maid.GiveTask(presenceComponent.presenceEnd.Connect((player: Player) => this.areaExit(player)));
	}

	areaEnter(player: Player) {
		this.inZone.add(player.UserId);
	}

	areaExit(player: Player) {
		this.inZone.delete(player.UserId);
	}

	playerRemoving(player: Player) {
		this.inZone.delete(player.UserId);
	}

	on1SecondInterval() {
		this.inZone.forEach((userId) => {
			const profile = serverStore.getState(selectPlayerSave(userId));
			if (!profile) {
				Log.Warn("No profile found for player {@PlayerID}", userId);
				return;
			}
			const timeWatched =
				profile.objectiveCompletion.find((objective) => objective.id === this.objectiveId)?.completion
					.timeWatched ?? 0;

			const objectiveCompletion = profile.objectiveCompletion.map((objective) => {
				if (objective.id === this.objectiveId) {
					const timeWatched = (objective.completion.timeWatched as number) ?? 0;
					return {
						id: this.objectiveId,
						completion: {
							timeWatched: timeWatched + 1,
						},
					};
				}
				return objective;
			});

			serverStore.updatePlayerSave(userId, {
				objectiveCompletion,
			});
		});
	}
}
