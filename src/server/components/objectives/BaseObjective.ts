import { BaseComponent, Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { ObjectiveService } from "server/services/ObjectiveService";
import { objectives } from "shared/constants/objectives";
import { ObjectiveCategory, ObjectiveID } from "shared/store/objectives";

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
	implements OnStart
{
	objectiveId: ObjectiveID;

	constructor(protected objectiveService: ObjectiveService) {
		super();
		this.objectiveId = objectives.find((objective) => objective.name === this.attributes.name)!.id;
	}

	onStart() {
		this.objectiveService.registerObjective(this.instance);
	}
}
