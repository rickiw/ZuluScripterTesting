import { Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { ObjectiveService } from "server/services/ObjectiveService";
import { BaseObjective, ObjectiveAttributes, ObjectiveInstance } from "./BaseObjective";

interface ResearchObjectiveAttributes extends ObjectiveAttributes {}

interface ResearchObjectiveInstance extends ObjectiveInstance {}

@Component({
	tag: "researchObjective",
})
export class ResearchObjective<A extends ResearchObjectiveAttributes, I extends ResearchObjectiveInstance>
	extends BaseObjective<A, I>
	implements OnStart
{
	constructor(protected objectiveService: ObjectiveService) {
		super(objectiveService);
	}

	onStart() {}
}
