import { Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { ObjectiveService } from "server/services/ObjectiveService";
import { BaseObjective, ObjectiveAttributes, ObjectiveInstance } from "./BaseObjective";

interface DeliverCratesAttributes extends ObjectiveAttributes {}

interface DeliverCratesInstance extends ObjectiveInstance {}

@Component({
	tag: "deliverCratesObjective",
})
export class DeliverCratesObjective<A extends DeliverCratesAttributes, I extends DeliverCratesInstance>
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
