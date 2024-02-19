import { Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { ObjectiveService } from "server/services/ObjectiveService";
import { BaseObjective, ObjectiveAttributes, ObjectiveInstance } from "./BaseObjective";

interface DeliverToolAttributes extends ObjectiveAttributes {}

interface DeliverToolInstance extends ObjectiveInstance {}

@Component({
	tag: "deliverToolObjective",
})
export class DeliverTool<A extends DeliverToolAttributes, I extends DeliverToolInstance>
	extends BaseObjective<A, I>
	implements OnStart
{
	constructor(protected objectiveService: ObjectiveService) {
		super(objectiveService);
	}

	onStart() {}
}
