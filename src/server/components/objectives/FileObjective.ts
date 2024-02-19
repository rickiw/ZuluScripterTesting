import { Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { ObjectiveService } from "server/services/ObjectiveService";
import { BaseObjective, ObjectiveAttributes, ObjectiveInstance } from "./BaseObjective";

interface FileObjectiveAttributes extends ObjectiveAttributes {}

interface FileObjectiveInstance extends ObjectiveInstance {}

@Component({
	tag: "fileObjective",
})
export class FileObjective<A extends FileObjectiveAttributes, I extends FileObjectiveInstance>
	extends BaseObjective<A, I>
	implements OnStart
{
	constructor(protected objectiveService: ObjectiveService) {
		super(objectiveService);
	}

	onStart() {}
}
