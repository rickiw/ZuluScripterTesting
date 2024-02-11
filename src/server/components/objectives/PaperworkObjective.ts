import { Component, Components } from "@flamework/components";
import { Dependency, OnStart } from "@flamework/core";
import Log from "@rbxts/log";
import Maid from "@rbxts/maid";
import { ObjectiveService } from "server/services/ObjectiveService";
import { BaseInteraction } from "shared/components/BaseInteraction";
import { BaseObjective, ObjectiveAttributes, ObjectiveInstance } from "./BaseObjective";

interface PaperworkObjectiveAttributes extends ObjectiveAttributes {}

interface PaperworkObjectiveInstance extends ObjectiveInstance {
	Desk1: BasePart & {
		ProximityAttachment: Attachment;
		ProximityPrompt: ProximityPrompt;
	};
	Desk2: BasePart & {
		ProximityAttachment: Attachment;
		ProximityPrompt: ProximityPrompt;
	};
}

@Component({
	tag: "paperworkObjective",
})
export class PaperworkObjective<A extends PaperworkObjectiveAttributes, I extends PaperworkObjectiveInstance>
	extends BaseObjective<A, I>
	implements OnStart
{
	interactComponents: BaseInteraction<any, any>[] = [];
	maid = new Maid();

	constructor(protected objectiveService: ObjectiveService) {
		super(objectiveService);
	}

	onStart() {
		const components = Dependency<Components>();
		if (
			!this.instance.Desk1 ||
			!this.instance.Desk2 ||
			!this.instance.Desk1.ProximityPrompt.HasTag("baseInteraction") ||
			!this.instance.Desk2.ProximityPrompt.HasTag("baseInteraction")
		) {
			Log.Error("PaperworkObjective must have a InteractPrompt");
			return;
		}

		const desk1InteractComponent = components.getComponent<BaseInteraction<any, any>>(
			this.instance.Desk1.ProximityPrompt,
		);
		const desk2InteractComponent = components.getComponent<BaseInteraction<any, any>>(
			this.instance.Desk2.ProximityPrompt,
		);
		if (!desk1InteractComponent || !desk2InteractComponent) {
			Log.Error("PaperworkObjective must have a InteractPrompt");
			return;
		}

		this.interactComponents.push(desk1InteractComponent, desk2InteractComponent);
		this.maid.GiveTask(desk1InteractComponent.activated.Connect((player) => this.desk1Interact(player)));
		this.maid.GiveTask(desk2InteractComponent.activated.Connect((player) => this.desk2Interact(player)));
	}

	desk1Interact(player: Player) {}

	desk2Interact(player: Player) {}
}
