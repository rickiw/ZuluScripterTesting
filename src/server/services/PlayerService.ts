import { Modding, OnStart, Service } from "@flamework/core";
import { Players, Workspace } from "@rbxts/services";
import { balancedDamageFunction, getCaliberData } from "shared/types/combat/FirearmWeapon";
import { BaseCharacter } from "../../CharacterTypes";

export interface PlayerRemoving {
	playerRemoving(player: Player): void;
}

export interface PlayerAdded {
	playerAdded(player: Player): void;
}

@Service()
export class PlayerService implements OnStart, PlayerAdded {
	constructor() {}

	characterAdded(character: BaseCharacter) {
		character.AddTag("character");
	}

	playerAdded(player: Player) {
		player.AddTag("player");

		if (player.Character) {
			this.characterAdded(player.Character as BaseCharacter);
		}
		player.CharacterAdded.Connect((character) => {
			this.characterAdded(character as BaseCharacter);
		});

		// debug: calculate caliber damage
		const sorry = Workspace.WaitForChild("reallyunique") as BasePart;
		player.Chatted.Connect((message) => {
			if (message.sub(0, 2) !== ">>") return;
			message = message.gsub(">>", "")[0];
			const formatted = getCaliberData(message);
			const res = formatted.diameter * formatted.length;
			sorry.SetAttribute("title", `CALIBER: ${message}`);
			sorry.SetAttribute("description", `DAMAGE: ${tostring(balancedDamageFunction(res))}`);
		});
	}

	onStart() {
		const playerAddedListeners = new Set<PlayerAdded>();
		Modding.onListenerAdded<PlayerAdded>((object) => playerAddedListeners.add(object));
		Modding.onListenerRemoved<PlayerAdded>((object) => playerAddedListeners.delete(object));
		Players.PlayerAdded.Connect((player) => {
			for (const listener of playerAddedListeners) {
				task.spawn(() => listener.playerAdded(player));
			}
		});
		for (const player of Players.GetPlayers()) {
			for (const listener of playerAddedListeners) {
				task.spawn(() => listener.playerAdded(player));
			}
		}

		const playerRemovingListeners = new Set<PlayerRemoving>();
		Modding.onListenerAdded<PlayerRemoving>((object) => playerRemovingListeners.add(object));
		Modding.onListenerRemoved<PlayerRemoving>((object) => playerRemovingListeners.delete(object));
		Players.PlayerRemoving.Connect((player) => {
			for (const listener of playerRemovingListeners) {
				task.spawn(() => listener.playerRemoving(player));
			}
		});
		for (const player of Players.GetPlayers()) {
			for (const listener of playerRemovingListeners) {
				task.spawn(() => listener.playerRemoving(player));
			}
		}
	}
}
