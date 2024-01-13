import { Component, Components } from "@flamework/components";
import { Dependency, OnStart } from "@flamework/core";
import Maid from "@rbxts/maid";
import { BaseInteraction, OnInteract } from "shared/components/BaseInteraction";
import { BaseNPC } from "../npc/BaseNPC";

export interface BaseSCPInstance extends Model {}

export interface SCPAttributes {}

export interface OnWaypointReached {
	waypointReached(): void;
}

export type PathfindErrorType = "LimitReached" | "TargetUnreachable" | "ComputationError" | "AgentStuck";

export interface OnPathfind {
	pathfindFinished(): void;
	pathfindBlocked(): void;
	pathfindError(error: PathfindErrorType): void;
}

@Component({
	defaults: {},
	tag: "baseSCP",
})
export class BaseSCP<A extends SCPAttributes, I extends BaseSCPInstance>
	extends BaseNPC<A, I>
	implements OnStart, OnInteract
{
	maid: Maid;
	interactComponents: BaseInteraction<any, any>[];

	constructor() {
		super();

		this.maid = new Maid();
		this.interactComponents = [];
	}

	bootstrap() {
		const components = Dependency<Components>();

		for (const value of this.instance.GetDescendants()) {
			if (value.HasTag("baseInteraction")) {
				const interactionComponent = components.getComponent<BaseInteraction<any, any>>(value);
				if (interactionComponent) {
					this.interactComponents.push(interactionComponent);
					this.maid.GiveTask(
						interactionComponent.activated.Connect((player: Player) => this.onInteract(player)),
					);
				}
			}
		}
	}

	onInteract(player: Player, prompt?: ProximityPrompt | undefined) {
		return true;
	}

	sendInteractionMessage(player: Player, message: string) {
		for (const interact of this.interactComponents) {
			interact.messageReceived.Fire(player, message);
		}
	}

	onStart() {
		this.bootstrap();
	}
}
