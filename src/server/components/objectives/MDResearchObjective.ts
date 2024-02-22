import { Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { ObjectiveService } from "server/services/ObjectiveService";
import { BaseObjective, ObjectiveAttributes, ObjectiveInstance } from "./BaseObjective";

interface MDResearchObjectiveAttributes extends ObjectiveAttributes {}

interface MDResearchObjectiveInstance extends ObjectiveInstance {}

@Component({
	tag: "mdResearchObjective",
})
export class MDResearchObjective<A extends MDResearchObjectiveAttributes, I extends MDResearchObjectiveInstance>
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
