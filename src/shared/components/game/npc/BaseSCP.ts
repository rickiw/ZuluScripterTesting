import { BaseComponent, Component, Components } from "@flamework/components";
import { Dependency, OnStart } from "@flamework/core";
import Maid from "@rbxts/maid";
import { BaseInteraction, OnInteract } from "../BaseInteraction";

export interface BaseSCPInstance extends Model {}

export interface SCPAttributes {}

@Component({
	defaults: {},
	tag: "baseSCP",
})
export class BaseSCP<A extends SCPAttributes, I extends BaseSCPInstance>
	extends BaseComponent<A, I>
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
