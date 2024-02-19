import { Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { ObjectiveService } from "server/services/ObjectiveService";
import { BaseObjective, ObjectiveAttributes, ObjectiveInstance } from "./BaseObjective";

interface WiringObjectiveAttributes extends ObjectiveAttributes {}

interface WiringObjectiveInstance extends ObjectiveInstance {}

@Component({
	tag: "wiringObjective",
})
export class WiringObjective<A extends WiringObjectiveAttributes, I extends WiringObjectiveInstance>
	extends BaseObjective<A, I>
	implements OnStart
{
	constructor(protected objectiveService: ObjectiveService) {
		super(objectiveService);
	}

	onStart() {}
}
