import { Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { ObjectiveService } from "server/services/ObjectiveService";
import { BaseObjective, ObjectiveAttributes, ObjectiveInstance } from "./BaseObjective";

interface PatrolObjectiveAttributes extends ObjectiveAttributes {}

interface PatrolObjectiveInstance extends ObjectiveInstance {}

@Component({
	tag: "patrolObjective",
})
export class PatrolObjective<A extends PatrolObjectiveAttributes, I extends PatrolObjectiveInstance>
	extends BaseObjective<A, I>
	implements OnStart
{
	constructor(protected objectiveService: ObjectiveService) {
		super(objectiveService);
	}

	onStart() {}
}
