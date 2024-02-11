import { Component, Components } from "@flamework/components";
import { Dependency, OnStart } from "@flamework/core";
import Log from "@rbxts/log";
import Maid from "@rbxts/maid";
import { ObjectiveService } from "server/services/ObjectiveService";
import { BaseInteraction } from "shared/components/BaseInteraction";
import { BaseObjective, ObjectiveAttributes, ObjectiveInstance } from "./BaseObjective";

interface CoffeeObjectiveAttributes extends ObjectiveAttributes {}

interface CoffeeObjectiveInstance extends ObjectiveInstance {
	VendingMachine: BasePart & {
		Scanner: MeshPart & {
			Attachment: Attachment;
			InteractPrompt: ProximityPrompt;
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
		Log.Warn("Vending machine interact by {@Player}", player.Name);
	}

	workerInteract(player: Player) {
		Log.Warn("Worker interact by {@Player}", player.Name);
	}
}
