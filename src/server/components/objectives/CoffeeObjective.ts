import { Component, Components } from "@flamework/components";
import { Dependency, OnStart } from "@flamework/core";
import Log from "@rbxts/log";
import Maid from "@rbxts/maid";
import { ObjectiveService } from "server/services/ObjectiveService";
import { PlayerRemoving } from "server/services/PlayerService";
import { serverStore } from "server/store";
import { selectPlayerSave } from "server/store/saves";
import { BaseInteraction } from "shared/components/BaseInteraction";
import { PlayerID } from "shared/constants/clans";
import { giveTool, removeTool } from "shared/utils";
import { BaseObjective, ObjectiveAttributes, ObjectiveInstance } from "./BaseObjective";

interface CoffeeObjectiveAttributes extends ObjectiveAttributes {}

interface CoffeeObjectiveInstance extends ObjectiveInstance {
	VendingMachine: BasePart & {
		Scanner: MeshPart & {
			Attachment: Attachment;
			InteractPrompt: ProximityPrompt;
		};
		Coffee: Tool & {
			Handle: MeshPart;
		};
	};
	Worker: Model & {
		Head: BasePart & {
			ProximityAttachment: Attachment;
			ProximityPrompt: ProximityPrompt;
		};
	};
}

@Component({
	tag: "coffeeObjective",
})
export class CoffeeObjective<A extends CoffeeObjectiveAttributes, I extends CoffeeObjectiveInstance>
	extends BaseObjective<A, I>
	implements OnStart, PlayerRemoving
{
	interactComponents: BaseInteraction<any, any>[] = [];
	maid = new Maid();

	private holdingCoffee: Set<PlayerID> = new Set();

	constructor(protected objectiveService: ObjectiveService) {
		super(objectiveService);
	}

	onStart() {
		super.onStart();
		const components = Dependency<Components>();
		if (
			!this.instance.VendingMachine ||
			!this.instance.VendingMachine.Scanner.InteractPrompt.HasTag("baseInteraction")
		) {
			Log.Error("CoffeeObjective must have a InteractPrompt");
			return;
		}

		const vendingInteractComponent = components.getComponent<BaseInteraction<any, any>>(
			this.instance.VendingMachine.Scanner.InteractPrompt,
		);
		const workerInteractComponent = components.getComponent<BaseInteraction<any, any>>(
			this.instance.Worker.Head.ProximityPrompt,
		);
		if (!vendingInteractComponent || !workerInteractComponent) {
			Log.Error("CoffeeObjective is missing either Worker or VendingMachine interactComponent");
			return;
		}

		this.interactComponents.push(vendingInteractComponent, workerInteractComponent);
		this.maid.GiveTask(
			vendingInteractComponent.activated.Connect((player: Player) => this.vendingInteract(player)),
		);
		this.maid.GiveTask(workerInteractComponent.activated.Connect((player: Player) => this.workerInteract(player)));
	}

	vendingInteract(player: Player) {
		const alreadyHolding = this.holdingCoffee.has(player.UserId);
		if (alreadyHolding) {
			return;
		}

		const profile = serverStore.getState(selectPlayerSave(player.UserId));
		if (!profile) {
			Log.Warn("No profile found for player {@PlayerID}", player.Name);
			return;
		}

		const objectiveCompletion = profile.objectiveCompletion.find((objective) => this.objectiveId === objective.id);
		if (objectiveCompletion && objectiveCompletion.completion.completed) {
			return;
		}

		this.holdingCoffee.add(player.UserId);
		giveTool(player, this.instance.VendingMachine.Coffee);
	}

	workerInteract(player: Player) {
		const holdingCoffee = this.holdingCoffee.has(player.UserId);
		if (!holdingCoffee) {
			return;
		}

		const completed = this.hasCompletedObjective(player, this.objectiveId);
		if (completed) {
			return;
		}

		removeTool(player, "Coffee");
		this.holdingCoffee.delete(player.UserId);
		this.objectiveService.completeObjective(player, this.objective, { completed: true });
	}

	playerRemoving(player: Player) {
		this.holdingCoffee.delete(player.UserId);
	}
}
