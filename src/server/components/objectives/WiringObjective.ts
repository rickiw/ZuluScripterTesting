import { Component, Components } from "@flamework/components";
import { Dependency, OnStart } from "@flamework/core";
import Log from "@rbxts/log";
import Maid from "@rbxts/maid";
import { CharacterRigR15 } from "@rbxts/promise-character";
import { ObjectiveService } from "server/services/ObjectiveService";
import { BaseInteraction } from "shared/components/BaseInteraction";
import { BaseObjective, ObjectiveAttributes, ObjectiveInstance } from "./BaseObjective";

interface WiringObjectiveAttributes extends ObjectiveAttributes {}

interface WiringObjectiveInstance extends ObjectiveInstance {
	BreakerBox: Model & {
		Panel: BasePart & {
			ProximityAttachment: Attachment;
			ProximityPrompt: ProximityPrompt;
		};
	};
}

@Component({
	tag: "wiringObjective",
})
export class WiringObjective<A extends WiringObjectiveAttributes, I extends WiringObjectiveInstance>
	extends BaseObjective<A, I>
	implements OnStart
{
	interactComponents: BaseInteraction<any, any>[] = [];
	maid = new Maid();

	private fixing: Set<Player> = new Set();

	constructor(protected objectiveService: ObjectiveService) {
		super(objectiveService);
	}

	onStart() {
		super.onStart();
		const components = Dependency<Components>();
		if (!this.instance.BreakerBox || !this.instance.BreakerBox.Panel.ProximityPrompt.HasTag("baseInteraction")) {
			Log.Error("WiringObjective must have a InteractPrompt");
			return;
		}

		const wiringInteractComponent = components.getComponent<BaseInteraction<any, any>>(
			this.instance.BreakerBox.Panel.ProximityPrompt,
		);
		if (!wiringInteractComponent) {
			Log.Error("WiringObjective must have a InteractPrompt");
			return;
		}
		this.interactComponents.push(wiringInteractComponent);
		this.maid.GiveTask(
			wiringInteractComponent.activated.Connect((player) => {
				if (this.isDoingObjective(player)) {
					this.fixWiring(player);
				}
			}),
		);
	}

	fixWiring(player: Player) {
		if (this.fixing.has(player)) {
			return;
		}
		this.fixing.add(player);
		const character = player.Character as CharacterRigR15;
		const walkSpeed = character.Humanoid.WalkSpeed;
		character.Humanoid.WalkSpeed = 0;
		task.delay(10, () => {
			if (player && player.Character) {
				character.Humanoid.WalkSpeed = walkSpeed;
				this.fixing.delete(player);

				this.objectiveService.completeObjective(player, this.objective, { completed: true });
			}
		});
	}
}
