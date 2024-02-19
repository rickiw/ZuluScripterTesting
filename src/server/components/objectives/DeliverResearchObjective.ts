import { Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { ObjectiveService } from "server/services/ObjectiveService";
import { BaseObjective, ObjectiveAttributes, ObjectiveInstance } from "./BaseObjective";

interface DeliverResearchAttributes extends ObjectiveAttributes {}

interface DeliverResearchInstance extends ObjectiveInstance {}

@Component({
	tag: "deliverResearchObjective",
})
export class DeliverResearch<A extends DeliverResearchAttributes, I extends DeliverResearchInstance>
	extends BaseObjective<A, I>
	implements OnStart
{
	constructor(protected objectiveService: ObjectiveService) {
		super(objectiveService);
	}

	onStart() {}
}
