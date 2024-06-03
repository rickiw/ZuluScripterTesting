import { OnStart, Service } from "@flamework/core";
import { CharacterRigR15 } from "@rbxts/promise-character";
import { BuildRagdollConstraints, SetRagdollEnabled } from "@rbxts/r15-ragdoll";
import { Events } from "server/network";
import { serverStore } from "server/store";
import { CharacterAdded } from "./PlayerService";

@Service()
export class RagdollService implements OnStart, CharacterAdded {
	onStart() {
		Events.HelpTwo.connect((player) => {
			serverStore.setPlayerAlive({ player, alive: false });
			const character = player.Character as CharacterRigR15;
			// character.Humanoid.WalkSpeed = 0;

			SetRagdollEnabled((player.Character as CharacterRigR15).Humanoid, true);
			task.delay(1, () => {
				warn("Setting ragdoll ownership");
				character.Humanoid.ChangeState(Enum.HumanoidStateType.Physics);
			});
		});
	}

	characterAdded(character: CharacterRigR15) {
		BuildRagdollConstraints(character.Humanoid);
	}
}
