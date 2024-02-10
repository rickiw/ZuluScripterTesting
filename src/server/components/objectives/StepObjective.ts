import { Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { ObjectiveService } from "server/services/ObjectiveService";
import { BaseObjective, ObjectiveAttributes, ObjectiveInstance } from "./BaseObjective";

interface StepObjectiveAttributes extends ObjectiveAttributes {}

interface StepObjectiveInstance extends ObjectiveInstance {}

@Component({
	tag: "stepObjective",
})
export class StepObjective<A extends StepObjectiveAttributes, I extends StepObjectiveInstance>
	extends BaseObjective<A, I>
	implements OnStart
{
	constructor(protected objectiveService: ObjectiveService) {
		super(objectiveService);
	}

	onStart() {}
}
