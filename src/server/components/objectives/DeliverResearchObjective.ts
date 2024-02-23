import { Component, Components } from "@flamework/components";
import { Dependency, OnStart } from "@flamework/core";
import Log from "@rbxts/log";
import Maid from "@rbxts/maid";
import { ObjectiveService } from "server/services/ObjectiveService";
import { serverStore } from "server/store";
import { selectPlayerSave } from "server/store/saves";
import { BaseInteraction } from "shared/components/BaseInteraction";
import { giveTool, removeTool } from "shared/utils";
import { BaseObjective, ObjectiveAttributes, ObjectiveInstance } from "./BaseObjective";

interface DeliverResearchAttributes extends ObjectiveAttributes {}

interface DeliverResearchInstance extends ObjectiveInstance {
	Paperwork: Tool & {
		Handle: UnionOperation;
	};
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
	tag: "deliverResearchObjective",
})
export class DeliverResearch<A extends DeliverResearchAttributes, I extends DeliverResearchInstance>
	extends BaseObjective<A, I>
	implements OnStart
{
	interactComponents: BaseInteraction<any, any>[] = [];
	maid = new Maid();

	private holdingPaperwork: Set<Player> = new Set();

	constructor(protected objectiveService: ObjectiveService) {
		super(objectiveService);
	}

	onStart() {
		super.onStart();
		const components = Dependency<Components>();
		if (
			!this.instance.Desk1 ||
			!this.instance.Desk2 ||
			!this.instance.Desk1.ProximityPrompt.HasTag("baseInteraction") ||
			!this.instance.Desk2.ProximityPrompt.HasTag("baseInteraction")
		) {
			Log.Error("DeliverResearchObjective must have a InteractPrompt");
			return;
		}

		const desk1InteractComponent = components.getComponent<BaseInteraction<any, any>>(
			this.instance.Desk1.ProximityPrompt,
		);
		const desk2InteractComponent = components.getComponent<BaseInteraction<any, any>>(
			this.instance.Desk2.ProximityPrompt,
		);
		if (!desk1InteractComponent || !desk2InteractComponent) {
			Log.Error("DeliverResearchObjective must have a InteractPrompt");
			return;
		}

		this.interactComponents.push(desk1InteractComponent, desk2InteractComponent);
		this.maid.GiveTask(
			desk1InteractComponent.activated.Connect((player) => {
				if (this.isDoingObjective(player)) this.desk1Interact(player);
			}),
		);
		this.maid.GiveTask(
			desk2InteractComponent.activated.Connect((player) => {
				if (this.isDoingObjective(player)) this.desk2Interact(player);
			}),
		);
	}

	desk1Interact(player: Player) {
		const alreadyHolding = this.holdingPaperwork.has(player);
		if (alreadyHolding) return;

		const profile = serverStore.getState(selectPlayerSave(player.UserId));
		if (!profile) {
			Log.Warn("No profile found for player {@PlayerID}", player.Name);
			return;
		}

		const objectiveCompletion = profile.objectiveCompletion.find((objective) => this.objectiveId === objective.id);
		if (objectiveCompletion && objectiveCompletion.completion.completed) return;

		this.holdingPaperwork.add(player);
		giveTool(player, this.instance.Paperwork);
	}

	desk2Interact(player: Player) {
		const holdingPaperwork = this.holdingPaperwork.has(player);
		if (!holdingPaperwork) return;

		const completed = this.hasCompletedObjective(player, this.objectiveId);
		if (completed) return;

		removeTool(player, "Paperwork");
		this.holdingPaperwork.delete(player);

		this.objectiveService.completeObjective(player, this.objective, { completed: true });
	}

	playerRemoving(player: Player) {
		this.holdingPaperwork.delete(player);
	}
}
