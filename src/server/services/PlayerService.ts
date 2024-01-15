import { Modding, OnStart, Service } from "@flamework/core";
import { CharacterRigR15 } from "@rbxts/promise-character";
import { Players } from "@rbxts/services";

export interface PlayerRemoving {
	playerRemoving(player: Player): void;
}

export interface PlayerAdded {
	playerAdded(player: Player): void;
}

export interface CharacterAdded {
	characterAdded(character: CharacterRigR15): void;
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
		const characterAddedListeners = new Set<CharacterAdded>();
		Modding.onListenerAdded<PlayerAdded>((object) => playerAddedListeners.add(object));
		Modding.onListenerAdded<CharacterAdded>((object) => characterAddedListeners.add(object));
		Modding.onListenerRemoved<PlayerAdded>((object) => playerAddedListeners.delete(object));
		Modding.onListenerRemoved<CharacterAdded>((object) => characterAddedListeners.delete(object));
		Players.PlayerAdded.Connect((player) => {
			for (const listener of playerAddedListeners) {
				task.spawn(() => listener.playerAdded(player));
				task.spawn(() => {
					const character = player.Character || player.CharacterAdded.Wait()[0];
					for (const listener of characterAddedListeners) {
						task.spawn(() => listener.characterAdded(character as CharacterRigR15));
					}
				});
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
