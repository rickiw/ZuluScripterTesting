import { Controller, OnStart } from "@flamework/core";
import { CharacterRigR15 } from "@rbxts/promise-character";
import { Players, UserInputService } from "@rbxts/services";
import { Events } from "client/network";
import { clientStore } from "client/store";
import { playSound } from "shared/assets/sounds";

const player = Players.LocalPlayer!;
const character = (player.Character || player.CharacterAdded.Wait()[0]) as CharacterRigR15;

@Controller()
export class FirearmController implements OnStart {
	onStart() {
		Events.PlayHitmarker.connect(() => this.playHitmarker());
		Events.EnemyKilled.connect(() => clientStore.setHasKilledEnemy(true));

		UserInputService.InputBegan.Connect((input) => {
			if (input.KeyCode === Enum.KeyCode.Home) {
				Events.Help.fire();
			}
		});
	}

	playHitmarker() {
		playSound("rbxassetid://160432334", { volume: 1.5, lifetime: 1 });
	}
}
