import { Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { ObjectiveService } from "server/services/ObjectiveService";
import { BaseObjective, ObjectiveAttributes, ObjectiveInstance } from "./BaseObjective";

interface KillTaskForceObjectiveAttributes extends ObjectiveAttributes {}

interface KillTaskForceObjectiveInstance extends ObjectiveInstance {}

@Component({
	tag: "killTaskForceObjective",
})
export class KillTaskForceObjective<
		A extends KillTaskForceObjectiveAttributes,
		I extends KillTaskForceObjectiveInstance,
	>
	extends BaseObjective<A, I>
	implements OnStart
{
	constructor(protected objectiveService: ObjectiveService) {
		super(objectiveService);
	}

	onStart() {}
}
