import { Modding, OnStart, Service } from "@flamework/core";
import { CharacterRigR15 } from "@rbxts/promise-character";
import { Players } from "@rbxts/services";
import { ListenerData } from "shared/utils";

export interface PlayerRemoving {
	playerRemoving(player: Player): void;
}

export interface PlayerAdded {
	playerAdded(player: Player): void;
}

export interface CharacterAdded {
	characterAdded(character: CharacterRigR15): void;
}

export interface CharacterRemoving {
	characterRemoving(player: Player, character: CharacterRigR15): void;
}

@Service()
export class PlayerService implements OnStart {
	private readonly playerAddedEvents = new Array<ListenerData<PlayerAdded>>();

	private playerAddedListeners = new Set<PlayerAdded>();
	private characterAddedListeners = new Set<CharacterAdded>();
	private characterRemovingListeners = new Set<CharacterRemoving>();
	private playerRemovingListeners = new Set<PlayerRemoving>();

	characterAdded(character: Model) {
		character.AddTag("character");

		for (const listener of this.characterAddedListeners) {
			task.spawn(() => listener.characterAdded(character as CharacterRigR15));
		}
	}

	playerAdded(player: Player) {
		player.AddTag("player");

		for (const listener of this.playerAddedListeners) {
			task.spawn(() => listener.playerAdded(player));
		}

		const character = player.Character;
		if (character) {
			this.characterAdded(character);
		}

		player.CharacterAdded.Connect((character) => this.characterAdded(character));
	}

	characterRemoving(player: Player, character: CharacterRigR15) {
		for (const listener of this.characterRemovingListeners) {
			task.spawn(() => listener.characterRemoving(player, character));
		}
	}

	onPlayerJoin(player: Player) {
		return Promise.resolve();
	}

	onStart() {
		// setupLifecycle<PlayerAdded>(this.playerAddedEvents);

		// onPlayerAdded((player) => {
		// 	this.onPlayerJoin(player).catch((err) => {
		// 		Log.Error("Failed to load player {@Player}: {@Error}", player.Name, err);
		// 	});
		// });

		const { playerAddedListeners, characterAddedListeners, playerRemovingListeners, characterRemovingListeners } =
			this;

		Modding.onListenerAdded<PlayerAdded>((object) => playerAddedListeners.add(object));
		Modding.onListenerRemoved<PlayerAdded>((object) => playerAddedListeners.delete(object));

		Modding.onListenerAdded<CharacterAdded>((object) => characterAddedListeners.add(object));
		Modding.onListenerRemoved<CharacterAdded>((object) => characterAddedListeners.delete(object));

		Modding.onListenerAdded<PlayerRemoving>((object) => playerRemovingListeners.add(object));
		Modding.onListenerRemoved<PlayerRemoving>((object) => playerRemovingListeners.delete(object));

		Modding.onListenerAdded<CharacterRemoving>((object) => this.characterRemovingListeners.add(object));
		Modding.onListenerRemoved<CharacterRemoving>((object) => characterRemovingListeners.delete(object));

		Players.PlayerAdded.Connect((player) => {
			this.playerAdded(player);
			player.CharacterRemoving.Connect((character) => {
				for (const listener of characterRemovingListeners) {
					task.spawn(() => listener.characterRemoving(player, character as CharacterRigR15));
				}
			});
		});
		for (const player of Players.GetPlayers()) {
			this.playerAdded(player);
		}

		Players.PlayerRemoving.Connect((player) => {
			for (const listener of playerRemovingListeners) {
				task.spawn(() => listener.playerRemoving(player));
			}
		});
	}
}
