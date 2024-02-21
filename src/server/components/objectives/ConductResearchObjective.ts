import { Component, Components } from "@flamework/components";
import { Dependency, OnStart } from "@flamework/core";
import Log from "@rbxts/log";
import Maid from "@rbxts/maid";
import { CharacterRigR15 } from "@rbxts/promise-character";
import { ObjectiveService } from "server/services/ObjectiveService";
import { BaseInteraction } from "shared/components/BaseInteraction";
import { BaseObjective, ObjectiveAttributes, ObjectiveInstance } from "./BaseObjective";

interface ConductResearchAttributes extends ObjectiveAttributes {}

interface ConductResearchInstance extends ObjectiveInstance {
	Desk: Model & {
		Wedge: WedgePart & {
			ProximityAttachment: Attachment;
			ProximityPrompt: ProximityPrompt;
		};
	};
	ResearchReport: BasePart;
}

@Component({
	tag: "conductResearchObjective",
})
export class ConductResearch<A extends ConductResearchAttributes, I extends ConductResearchInstance>
	extends BaseObjective<A, I>
	implements OnStart
{
	interactComponents: BaseInteraction<any, any>[] = [];
	maid = new Maid();

	private researching: Set<Player> = new Set();

	constructor(protected objectiveService: ObjectiveService) {
		super(objectiveService);
	}

	onStart() {
		super.onStart();
		const components = Dependency<Components>();
		if (!this.instance.Desk || !this.instance.Desk.Wedge.ProximityPrompt.HasTag("baseInteraction")) {
			Log.Error("ConductResearchObjective must have a InteractPrompt");
			return;
		}

		const deskInteractComponent = components.getComponent<BaseInteraction<any, any>>(
			this.instance.Desk.Wedge.ProximityPrompt,
		);
		if (!deskInteractComponent) {
			Log.Error("ConductResearchObjective must have a InteractPrompt");
			return;
		}
		this.interactComponents.push(deskInteractComponent);
		this.maid.GiveTask(
			deskInteractComponent.activated.Connect((player) => {
				if (this.isDoingObjective(player)) this.deskInteract(player);
			}),
		);
	}

	deskInteract(player: Player) {
		if (this.researching.has(player)) return;
		this.researching.add(player);
		const character = player.Character as CharacterRigR15;
		const walkSpeed = character.Humanoid.WalkSpeed;
		character.Humanoid.WalkSpeed = 0;
		task.delay(10, () => {
			if (player && player.Character) {
				character.Humanoid.WalkSpeed = walkSpeed;
				this.researching.delete(player);

				this.objectiveService.completeObjective(player, this.objective, { completed: true });
			}
		});
	}
}
