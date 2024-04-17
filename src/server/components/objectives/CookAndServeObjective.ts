import { Component, Components } from "@flamework/components";
import { OnStart } from "@flamework/core";
import Log from "@rbxts/log";
import Maid from "@rbxts/maid";
import { Events } from "server/network";
import { ObjectiveService } from "server/services/ObjectiveService";
import { serverStore } from "server/store";
import { BaseInteraction } from "shared/components/BaseInteraction";
import { giveTool } from "shared/utils";
import { BaseObjective, ObjectiveAttributes, ObjectiveInstance } from "./BaseObjective";

interface CookAndServeObjectiveAttributes extends ObjectiveAttributes {}

interface CookAndServeObjectiveInstance extends ObjectiveInstance {
	Food: Folder;
	Oven: Model & {
		Stove: Part & {
			ProximityAttachment: Attachment;
			ProximityPrompt: ProximityPrompt;
		};
	};
}

@Component({
	tag: "cookAndServeObjective",
})
export class CookAndServeObjective<A extends CookAndServeObjectiveAttributes, I extends CookAndServeObjectiveInstance>
	extends BaseObjective<A, I>
	implements OnStart
{
	interactComponents: BaseInteraction<any, any>[] = [];
	availableRecipes: string[] = [];
	foodTools: Record<string, ToolWithHandle> = {};
	maid = new Maid();

	constructor(
		protected objectiveService: ObjectiveService,
		private components: Components,
	) {
		super(objectiveService);
	}

	onStart() {
		super.onStart();
		const food = this.instance.Food.GetChildren();
		this.availableRecipes = serverStore.getState().food.recipes;

		if (!this.instance.Oven.Stove || !this.instance.Oven.Stove.ProximityPrompt.HasTag("baseInteraction")) {
			Log.Error("DeliverResearchObjective must have a InteractPrompt");
			return;
		}
		const cookPrompt = this.components.getComponent<BaseInteraction<any, any>>(
			this.instance.Oven.Stove.ProximityPrompt,
		);
		if (!cookPrompt) {
			Log.Error("DeliverResearchObjective must have a InteractPrompt");
			return;
		}
		this.interactComponents.push(cookPrompt);
		this.maid.GiveTask(
			cookPrompt.activated.Connect((player) => {
				this.cookInteract(player);
			}),
		);

		for (const tool of food) {
			if (!tool.IsA("Tool")) {
				continue;
			}
			if (!this.availableRecipes.includes(tool.Name)) {
				continue;
			}
			this.foodTools[tool.Name] = tool as ToolWithHandle;
		}

		Events.CookFood.connect((player, food) => {
			this.cookFood(player, food);
		});
	}

	cookInteract(player: Player) {
		const distance = player.Character?.PrimaryPart?.Position.sub(this.instance.Oven.Stove.Position).Magnitude;
		if (distance && distance > 10) {
			return;
		}
		Events.ToggleCookMenu(player);
	}

	cookFood(player: Player, food: string) {
		const distance = player.Character?.PrimaryPart?.Position.sub(this.instance.Oven.Stove.Position).Magnitude;
		if (distance && distance > 10) {
			return;
		}
		if (!this.foodTools[food]) {
			Log.Warn("Player tried to cook food that doesn't exist", player.Name, food);
			return;
		}
		giveTool(player, this.foodTools[food]);
	}
}
