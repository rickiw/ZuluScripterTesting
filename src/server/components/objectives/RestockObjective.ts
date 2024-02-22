import { Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { ObjectiveService } from "server/services/ObjectiveService";
import { BaseObjective, ObjectiveAttributes, ObjectiveInstance } from "./BaseObjective";

interface RestockObjectiveAttributes extends ObjectiveAttributes {}

interface RestockObjectiveInstance extends ObjectiveInstance {}

@Component({
	tag: "restockObjective",
})
export class RestockObjective<A extends RestockObjectiveAttributes, I extends RestockObjectiveInstance>
	extends BaseObjective<A, I>
	implements OnStart
{
	constructor(protected objectiveService: ObjectiveService) {
		super(objectiveService);
	}

	onStart() {
		super.onStart();
	}
}
