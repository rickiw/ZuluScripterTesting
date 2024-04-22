/**
 * @author </Nexus_Prime>
 * @description In case needed help to understand, go to https://nexusprime.vercel.app
 */

import { BaseComponent, Component, Components } from "@flamework/components";
import { Dependency, OnStart, Service } from "@flamework/core";
import Maid from "@rbxts/maid";
import { Workspace } from "@rbxts/services";
import { Events } from "server/network";
import { BaseInteraction } from "shared/components/BaseInteraction";

@Service()
export class ItemService implements OnStart {
	AFAK(player: Player, obj: unknown) {
		const { CFrame } = <{ CFrame: CFrame }>obj;
		const character = player.Character as BaseCharacter;

		const tool = character.FindFirstChild<Tool>("AFAK")!;
		const handle = tool.FindFirstChild<Part>("Handle")!;
		const item = handle.Clone();
		item.Name = "AFAK";
		item.SetAttribute("Uses", 3);
		item.CanCollide = true;
		item.Transparency = 0;
		item.CFrame = CFrame;
		item.Parent = Workspace;

		character.Humanoid.UnequipTools();
		tool.Destroy();

		task.wait(1);
		const proximityPrompt = new Instance("ProximityPrompt");
		proximityPrompt.Style = Enum.ProximityPromptStyle.Custom;
		proximityPrompt.AddTag("baseInteraction");
		proximityPrompt.Parent = item;
		item.AddTag("FAK");
	}

	FAK(player: Player, obj: unknown) {
		const { CFrame } = <{ CFrame: CFrame }>obj;
		const character = player.Character as BaseCharacter;

		const tool = character.FindFirstChild<Tool>("AFAK")!;
		const handle = tool.FindFirstChild<Part>("Handle")!;
		const item = handle.Clone();
		item.Name = "FAK";
		item.SetAttribute("Uses", 1);
		item.CanCollide = true;
		item.Transparency = 0;
		item.CFrame = CFrame;
		item.Parent = Workspace;

		character.Humanoid.UnequipTools();
		tool.Destroy();

		task.wait(1);
		const proximityPrompt = new Instance("ProximityPrompt");
		proximityPrompt.Style = Enum.ProximityPromptStyle.Custom;
		proximityPrompt.AddTag("baseInteraction");
		proximityPrompt.Parent = item;
		item.AddTag("FAK");
	}

	onStart() {
		Events.ItemAction.connect((p, obj) => {
			if (obj.name in this) {
				this[obj.name as keyof ItemService](p, obj);
			}
		});
	}
}

@Component({
	tag: "FAK",
})
export class FAK extends BaseComponent<{}, Part> implements OnStart {
	maid = new Maid();
	interactComponents: BaseInteraction<any, any>[];
	presenceComponents: object[];

	constructor() {
		super();
		this.interactComponents = [];
		this.presenceComponents = [];
	}

	onInteract(player: Player) {
		if (!player.Character || !player.Character.FindFirstChildOfClass("Humanoid")) {
			return;
		}

		const character = player.Character as BaseCharacter;

		character.Humanoid.Health = character.Humanoid.MaxHealth;
		this.instance.SetAttribute("Uses", (this.instance.GetAttribute("Uses") as number) - 1);

		if ((this.instance.GetAttribute("Uses") as number) < 1) {
			this.instance.Destroy();
		}
	}

	onStart() {
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
}
