import { Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { ObjectiveService } from "server/services/ObjectiveService";
import { BaseObjective, ObjectiveAttributes, ObjectiveInstance } from "./BaseObjective";

interface MopObjectiveAttributes extends ObjectiveAttributes {}

interface MopObjectiveInstance extends ObjectiveInstance {}

@Component({
	tag: "mopObjective",
})
export class MopObjective<A extends MopObjectiveAttributes, I extends MopObjectiveInstance>
	extends BaseObjective<A, I>
	implements OnStart
{
	constructor(protected objectiveService: ObjectiveService) {
		super(objectiveService);
	}

	onStart() {}
}
