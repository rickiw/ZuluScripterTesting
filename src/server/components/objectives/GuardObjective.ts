import { Component, Components } from "@flamework/components";
import { Dependency, OnStart } from "@flamework/core";
import { New } from "@rbxts/fusion";
import Log from "@rbxts/log";
import Maid from "@rbxts/maid";
import { Players } from "@rbxts/services";
import { ObjectiveService } from "server/services/ObjectiveService";
import { PlayerRemoving } from "server/services/PlayerService";
import { On1SecondInterval } from "server/services/TickService";
import { serverStore } from "server/store";
import { BasePresence, OnPresence } from "shared/components/BasePresence";
import { PlayerID } from "shared/constants/clans";
import { selectPlayerSave } from "shared/store/saves";
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
		this.maid.GiveTask(presenceComponent.presenceBegin.Connect((player: Player) => this.areaEnter(player)));
		this.maid.GiveTask(presenceComponent.presenceEnd.Connect((player: Player) => this.areaExit(player)));

		const Position = this.instance.GetBoundingBox()[0].Position;

		this.beacon = New("Part")({
			Anchored: true,
			Name: "Beacon",
			Parent: this.instance,
			Position,
			Size: new Vector3(500, 5, 5),
			Orientation: new Vector3(0, 0, 90),
			Color: Color3.fromRGB(63, 25, 180),
			CanCollide: false,
			Shape: Enum.PartType.Cylinder,
			Transparency: 1,
			Material: Enum.Material.Neon,
		});
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
			const profile = serverStore.getState(selectPlayerSave(userId));
			if (!profile) {
				Log.Warn("No profile found for player {@PlayerID}", userId);
				return;
			}

			const objectiveCompletion = profile.objectiveCompletion.map((objective) => {
				if (objective.id === this.objectiveId) {
					const completed = (objective.completion.completed as boolean) ?? false;
					const timeWatched = (objective.completion.timeWatched as number) ?? 0;
					if (completed && timeWatched >= this.attributes.goal) return objective;
					if (timeWatched >= this.attributes.goal) {
						this.objectiveService.completeObjective(Players.GetPlayerByUserId(userId)!, this.objective);
						return {
							id: this.objectiveId,
							completion: {
								completed: true,
								timeWatched: this.attributes.goal,
							},
						};
					}
					return {
						id: this.objectiveId,
						completion: {
							completed: false,
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
