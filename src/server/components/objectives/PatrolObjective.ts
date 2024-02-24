import { Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import Maid from "@rbxts/maid";
import { CharacterRigR15 } from "@rbxts/promise-character";
import { Players } from "@rbxts/services";
import { setInterval } from "@rbxts/set-timeout";
import { ObjectiveService } from "server/services/ObjectiveService";
import { PlayerRemoving } from "server/services/PlayerService";
import { PlayerID } from "shared/constants/clans";
import { BaseObjective, ObjectiveAttributes, ObjectiveInstance } from "./BaseObjective";

interface PatrolObjectiveAttributes extends ObjectiveAttributes {
	requiredSteps: number;
}

interface PatrolObjectiveInstance extends ObjectiveInstance {}

@Component({
	tag: "patrolObjective",
})
export class PatrolObjective<A extends PatrolObjectiveAttributes, I extends PatrolObjectiveInstance>
	extends BaseObjective<A, I>
	implements OnStart, PlayerRemoving
{
	private footSteps: Map<PlayerID, number> = new Map();
	private playerMaids: Map<PlayerID, Maid> = new Map();

	constructor(protected objectiveService: ObjectiveService) {
		super(objectiveService);
	}

	onStart() {
		super.onStart();
	}

	startObjective(player: Player): [complete: boolean, exists: boolean, started: boolean] {
		const [completed, existed, started] = super.startObjective(player);
		if (completed || existed) return [completed, existed, started];

		const maid = new Maid();
		this.playerMaids.set(player.UserId, maid);

		const completion = this.objectiveService.getCompletion(player, this.objectiveId);
		const steps = completion.steps ? (completion.steps as number) : 0;
		this.footSteps.set(player.UserId, steps);

		maid.GiveTask(
			setInterval(() => {
				const steps = this.footSteps.get(player.UserId);
				if (
					steps === undefined ||
					player === undefined ||
					!player.IsDescendantOf(Players) ||
					!this.isDoingObjective(player)
				) {
					return;
				}
				const character = player.Character as CharacterRigR15;
				if (
					character.Humanoid.MoveDirection !== Vector3.zero &&
					character.Humanoid.GetState() === Enum.HumanoidStateType.Running
				) {
					if (steps + 1 >= this.attributes.requiredSteps) {
						const completed = this.hasCompletedObjective(player, this.objectiveId);
						if (completed) return;

						this.objectiveService.completeObjective(player, this.objective, {
							completed: true,
							steps: this.attributes.requiredSteps,
						});
						return;
					}

					this.objectiveService.saveCompletion(player, this.objectiveId, {
						completed: steps >= this.attributes.requiredSteps,
						steps,
					});
					this.footSteps.set(player.UserId, steps + 1);
				}
			}, 0.5),
		);

		return [completed, existed, true];
	}

	cleanupPlayer(player: Player) {
		this.footSteps.delete(player.UserId);
		const maid = this.playerMaids.get(player.UserId);
		if (maid) {
			maid.Destroy();
			this.playerMaids.delete(player.UserId);
		}
	}

	stopObjective(player: Player): void {
		super.stopObjective(player);
		this.cleanupPlayer(player);
	}

	playerRemoving(player: Player) {
		this.cleanupPlayer(player);
	}
}
