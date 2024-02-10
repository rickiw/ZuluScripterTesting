import { BaseComponent, Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { ObjectiveService } from "server/services/ObjectiveService";
import { ObjectiveCategory } from "shared/store/objectives";

export interface ObjectiveAttributes {
	category: ObjectiveCategory;
}

export interface ObjectiveInstance extends Model {}

@Component({
	tag: "baseObjective",
})
export class BaseObjective<A extends ObjectiveAttributes, I extends ObjectiveInstance>
	extends BaseComponent<A, I>
	implements OnStart
{
	constructor(private objectiveService: ObjectiveService) {
		super();
	}

	onStart() {
		this.objectiveService.registerObjective(this.instance);
	}
}
