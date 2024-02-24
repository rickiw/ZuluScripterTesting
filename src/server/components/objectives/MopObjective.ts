import { Component, Components } from "@flamework/components";
import { Dependency, OnStart } from "@flamework/core";
import Log from "@rbxts/log";
import Maid from "@rbxts/maid";
import { CharacterRigR15 } from "@rbxts/promise-character";
import { Workspace } from "@rbxts/services";
import { ObjectiveService } from "server/services/ObjectiveService";
import { PlayerRemoving } from "server/services/PlayerService";
import { BaseInteraction } from "shared/components/BaseInteraction";
import { PlayerID } from "shared/constants/clans";
import { giveTool, removeTool } from "shared/utils";
import { BaseObjective, ObjectiveAttributes, ObjectiveInstance } from "./BaseObjective";

interface MopObjectiveAttributes extends ObjectiveAttributes {
	requiredSweeps: number;
}

interface MopObjectiveInstance extends ObjectiveInstance {
	Assets: Folder & {
		Broom: Tool & {
			Handle: BasePart;
		};
		Puddle: Model & {
			Primary: BasePart & {
				ProximityAttachment: Attachment;
				ProximityPrompt: ProximityPrompt;
			};
		};
	};
	Puddles: Folder & {
		[key: string]: Model;
	};
}

@Component({
	tag: "mopObjective",
})
export class MopObjective<A extends MopObjectiveAttributes, I extends MopObjectiveInstance>
	extends BaseObjective<A, I>
	implements OnStart, PlayerRemoving
{
	interactComponents: Map<string, BaseInteraction<any, any>> = new Map();
	maid = new Maid();

	private playerMaids: Map<PlayerID, Maid> = new Map();
	private sweptPuddles: Map<PlayerID, number> = new Map();

	constructor(protected objectiveService: ObjectiveService) {
		super(objectiveService);
	}

	onStart() {
		super.onStart();

		for (let i = 0; i < 5; i++) {
			this.spawnPuddle(new Vector3(5.75 * i, 0.25, -12.25));
		}
	}

	startObjective(player: Player): [complete: boolean, exists: boolean, started: boolean] {
		const [completed, existed, started] = super.startObjective(player);
		if (completed || existed) return [completed, existed, started];

		const maid = new Maid();
		this.playerMaids.set(player.UserId, maid);

		const completion = this.objectiveService.getCompletion(player, this.objectiveId);
		const swept = completion.swept ? (completion.swept as number) : 0;
		this.sweptPuddles.set(player.UserId, swept);
		this.addToDoing(player.UserId);

		const mop = this.instance.Assets.Broom.Clone();
		giveTool(player, mop);

		return [completed, existed, true];
	}

	stopObjective(player: Player) {
		super.stopObjective(player);
		removeTool(player, "Broom");
		const maid = this.playerMaids.get(player.UserId);
		if (maid) maid.DoCleaning();
		this.playerMaids.delete(player.UserId);
	}

	spawnPuddle(location: Vector3, lifetime: number = 30) {
		const puddle = this.instance.Assets.Puddle.Clone();
		puddle.Parent = this.instance.Puddles;
		puddle.Name = "Puddle" + math.random(1000, 9999);
		puddle.MoveTo(location);

		const components = Dependency<Components>();
		const interactComponent = components.getComponent<BaseInteraction<any, any>>(puddle.Primary.ProximityPrompt);
		if (!interactComponent) {
			Log.Warn("Puddle does not have a BaseInteraction component");
			return;
		}
		this.interactComponents.set(puddle.Name, interactComponent);

		interactComponent.activated.Connect((player) => {
			if (this.isDoingObjective(player)) this.sweepPuddle(player, puddle);
		});

		task.delay(lifetime, () => {
			if (puddle !== undefined && puddle.IsDescendantOf(Workspace)) {
				const beingSwept = puddle.GetAttribute("Sweeping") as boolean;
				if (beingSwept) return;
				puddle.Destroy();
				this.interactComponents.delete(puddle.Name);
			}
		});
	}

	sweepPuddle(player: Player, puddle: typeof this.instance.Assets.Puddle) {
		if (puddle.GetAttribute("Sweeping") === true) return;

		const swept = (this.objectiveService.getCompletion(player, this.objectiveId).swept as number) ?? 0;
		const character = player.Character as CharacterRigR15;
		character.Humanoid.WalkSpeed = 0;
		puddle.SetAttribute("Sweeping", true);

		task.delay(5, () => {
			if (player && player.Character) {
				character.Humanoid.WalkSpeed = 16;
				this.interactComponents.delete(puddle.Name);
				puddle.Destroy();
				if (swept + 1 >= this.attributes.requiredSweeps) {
					this.objectiveService.completeObjective(player, this.objective, {
						completed: true,
						swept: swept + 1,
					});

					return;
				}
				this.objectiveService.saveCompletion(player, this.objectiveId, { completed: false, swept: swept + 1 });
			}
		});
	}

	playerRemoving(player: Player) {
		this.sweptPuddles.delete(player.UserId);
	}
}
