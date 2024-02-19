import { Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { ObjectiveService } from "server/services/ObjectiveService";
import { BaseObjective, ObjectiveAttributes, ObjectiveInstance } from "./BaseObjective";

interface CookAndServeObjectiveAttributes extends ObjectiveAttributes {}

interface CookAndServeObjectiveInstance extends ObjectiveInstance {}

@Component({
	tag: "cookAndServeObjective",
})
export class CookAndServeObjective<A extends CookAndServeObjectiveAttributes, I extends CookAndServeObjectiveInstance>
	extends BaseObjective<A, I>
	implements OnStart
{
	constructor(protected objectiveService: ObjectiveService) {
		super(objectiveService);
	}

	onStart() {}
}
