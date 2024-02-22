import { Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { ObjectiveService } from "server/services/ObjectiveService";
import { BaseObjective, ObjectiveAttributes, ObjectiveInstance } from "./BaseObjective";

interface KillSecurityObjectiveAttributes extends ObjectiveAttributes {}

interface KillSecurityObjectiveInstance extends ObjectiveInstance {}

@Component({
	tag: "killSecurityObjective",
})
export class KillSecurityObjective<A extends KillSecurityObjectiveAttributes, I extends KillSecurityObjectiveInstance>
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
