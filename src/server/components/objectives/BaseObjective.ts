import { BaseComponent, Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { New } from "@rbxts/fusion";
import Log from "@rbxts/log";
import { Events } from "server/network";
import { ObjectiveService, OnObjectiveComplete } from "server/services/ObjectiveService";
import { serverStore } from "server/store";
import { PlayerID } from "shared/constants/clans";
import { objectives } from "shared/constants/objectives";
import { Objective, ObjectiveCategory, ObjectiveID } from "shared/store/objectives";
import { selectPlayerSave } from "shared/store/saves";

export interface ObjectiveAttributes {
	category: ObjectiveCategory;
	name: string;
}

export interface ObjectiveInstance extends Model {}

@Component({
	tag: "baseObjective",
})
export class BaseObjective<A extends ObjectiveAttributes, I extends ObjectiveInstance>
	extends BaseComponent<A, I>
	implements OnStart, OnObjectiveComplete
{
	objective: Objective;
	objectiveId: ObjectiveID;
	beacon!: BasePart;

	private doingObjective: Set<PlayerID> = new Set();

	constructor(protected objectiveService: ObjectiveService) {
		super();
		this.objective = objectives.find((objective) => objective.name === this.attributes.name)!;
		this.objectiveId = this.objective.id;

		Log.Warn("Registering objective {@Name}", this.attributes.name);
		this.objectiveService.registerObjective(this);
	}

	onStart() {
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

	hasCompletedObjective(player: Player, objectiveId: ObjectiveID) {
		const profile = serverStore.getState(selectPlayerSave(player.UserId));
		if (!profile) return false;
		const objective = profile.objectiveCompletion.find((objective) => objective.id === objectiveId);
		if (!objective) return false;
		return (objective.completion.completed as boolean) ?? false;
	}

	addToDoing(player: PlayerID) {
		this.doingObjective.add(player);
	}

	startObjective(player: Player, overrideIfCompleted: boolean = false): [complete: boolean, exists: boolean] {
		const hasCompleted = this.hasCompletedObjective(player, this.objectiveId);
		const exists = this.doingObjective.has(player.UserId);
		if (!hasCompleted && !exists) Events.ToggleBeacon.fire(player, this.objective.objectiveClass, true);
		if (!overrideIfCompleted) this.doingObjective.add(player.UserId);
		return [hasCompleted, exists];
	}

	stopObjective(player: Player) {
		Events.ToggleBeacon.fire(player, this.objective.objectiveClass, false);
		this.doingObjective.delete(player.UserId);
	}

	isDoingObjective(player: Player) {
		return this.doingObjective.has(player.UserId);
	}

	objectiveComplete(player: Player, objective: Objective) {
		if (objective.id === this.objectiveId) this.stopObjective(player);
	}
}
