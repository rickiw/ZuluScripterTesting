import { Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { ObjectiveService } from "server/services/ObjectiveService";
import { BaseObjective, ObjectiveAttributes, ObjectiveInstance } from "./BaseObjective";

interface PullupObjectiveAttributes extends ObjectiveAttributes {}

interface PullupObjectiveInstance extends ObjectiveInstance {}

@Component({
	tag: "pullupObjective",
})
export class PullupObjective<A extends PullupObjectiveAttributes, I extends PullupObjectiveInstance>
	extends BaseObjective<A, I>
	implements OnStart
{
	constructor(protected objectiveService: ObjectiveService) {
		super(objectiveService);
	}

	onStart() {}
}
