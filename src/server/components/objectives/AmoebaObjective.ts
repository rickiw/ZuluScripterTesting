import { Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { ObjectiveService } from "server/services/ObjectiveService";
import { BaseObjective, ObjectiveAttributes, ObjectiveInstance } from "./BaseObjective";

interface AmoebaObjectiveAttributes extends ObjectiveAttributes {}

interface AmoebaObjectiveInstance extends ObjectiveInstance {}

@Component({
	tag: "amoebaObjective",
})
export class AmoebaObjective<A extends AmoebaObjectiveAttributes, I extends AmoebaObjectiveInstance>
	extends BaseObjective<A, I>
	implements OnStart
{
	constructor(protected objectiveService: ObjectiveService) {
		super(objectiveService);
	}

	onStart() {}
}
