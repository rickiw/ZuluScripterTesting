import { Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { ObjectiveService } from "server/services/ObjectiveService";
import { BaseObjective, ObjectiveAttributes, ObjectiveInstance } from "./BaseObjective";

interface ReportObjectiveAttributes extends ObjectiveAttributes {}

interface ReportObjectiveInstance extends ObjectiveInstance {}

@Component({
	tag: "reportObjective",
})
export class ReportObjective<A extends ReportObjectiveAttributes, I extends ReportObjectiveInstance>
	extends BaseObjective<A, I>
	implements OnStart
{
	constructor(protected objectiveService: ObjectiveService) {
		super(objectiveService);
	}

	onStart() {}
}
