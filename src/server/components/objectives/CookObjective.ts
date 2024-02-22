import { Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { ObjectiveService } from "server/services/ObjectiveService";
import { BaseObjective, ObjectiveAttributes, ObjectiveInstance } from "./BaseObjective";

interface CookObjectiveAttributes extends ObjectiveAttributes {}

interface CookObjectiveInstance extends ObjectiveInstance {}

@Component({
	tag: "cookObjective",
})
export class CookObjective<A extends CookObjectiveAttributes, I extends CookObjectiveInstance>
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
