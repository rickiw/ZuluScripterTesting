import { Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { ObjectiveService } from "server/services/ObjectiveService";
import { BaseObjective, ObjectiveAttributes, ObjectiveInstance } from "./BaseObjective";

interface CookAndServeObjectiveAttributes extends ObjectiveAttributes {}

interface CookAndServeObjectiveInstance extends ObjectiveInstance {
	Food: Folder;
}

@Component({
	tag: "cookAndServeObjective",
})
export class CookAndServeObjective<A extends CookAndServeObjectiveAttributes, I extends CookAndServeObjectiveInstance>
	extends BaseObjective<A, I>
	implements OnStart
{
	private foodClones: {
		[key in FoodTypes]: Tool;
	} = {} as any;

	constructor(protected objectiveService: ObjectiveService) {
		super(objectiveService);
	}

	onStart() {
		super.onStart();
		const food = this.instance.Food.GetChildren();
		for (const toolClone of food) {
			const tool = toolClone.Clone() as Tool;
			this.foodClones[tool.Name as FoodTypes] = tool;
		}
	}
}
