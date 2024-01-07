import { Modding, OnStart, Service } from "@flamework/core";
import { Players } from "@rbxts/services";

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
