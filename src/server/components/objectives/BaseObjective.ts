import { BaseComponent, Component } from "@flamework/components";
import { Modding, OnStart } from "@flamework/core";
import Log from "@rbxts/log";
import { ObjectiveService } from "server/services/ObjectiveService";
import { objectives } from "shared/constants/objectives";
import { Objective, ObjectiveCategory, ObjectiveID } from "shared/store/objectives";

export interface ObjectiveAttributes {
	category: ObjectiveCategory;
	name: string;
}

export interface ObjectiveInstance extends Model {}

export interface OnObjectiveComplete {
	objectiveComplete(player: Player, objective: Objective): void;
}

@Component({
	tag: "baseObjective",
})
export class BaseObjective<A extends ObjectiveAttributes, I extends ObjectiveInstance>
	extends BaseComponent<A, I>
	implements OnStart
{
	objective: Objective;
	objectiveId: ObjectiveID;
	beacon!: BasePart;

	private objectiveCompleteListeners = new Set<OnObjectiveComplete>();

	constructor(protected objectiveService: ObjectiveService) {
		super();
		this.objective = objectives.find((objective) => objective.name === this.attributes.name)!;
		this.objectiveId = this.objective.id;
	}

	onStart() {
		this.objectiveService.registerObjective(this.instance);

		Modding.onListenerAdded<OnObjectiveComplete>((object) => this.objectiveCompleteListeners.add(object));
		Modding.onListenerRemoved<OnObjectiveComplete>((object) => this.objectiveCompleteListeners.delete(object));
	}

	completeObjective(player: Player) {
		Log.Warn("Objective complete");
		this.objectiveCompleteListeners.forEach((listener) => listener.objectiveComplete(player, this.objective));
	}
}
