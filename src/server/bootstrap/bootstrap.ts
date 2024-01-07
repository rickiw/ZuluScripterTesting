import { New } from "@rbxts/fusion";
import { createBroadcaster } from "@rbxts/reflex";
import { Players } from "@rbxts/services";
import { store } from "server/store";
import { Body, Client, Renderable } from "shared/components";
import { Network } from "shared/network";
import { slices } from "shared/slices";
import { getBootstrapData } from ".";

export async function bootstrap() {
	const { world, state, profileStore } = getBootstrapData();

	function playerRemoving(player: Player) {
		state.clients.delete(player.UserId);
		const profile = state.profiles.get(player);
		if (profile) {
			profile.Release();
			state.profiles.delete(player);
		}
	}
	function playerAdded(player: Player) {
		function handleData() {
			const profile = profileStore.LoadProfileAsync("Player_" + player.UserId);
			if (!profile) {
				return player.Kick("Failed to load profile");
			}
			profile.AddUserId(player.UserId);
			profile.Reconcile();
			profile.ListenToRelease(() => {
				state.profiles.delete(player);
				player.Kick("Session was terminated");
			});
			if (player.IsDescendantOf(Players)) {
				const leaderstats = New("Folder")({
					Name: "leaderstats",
					Parent: player,
				});

				return state.profiles.set(player, profile);
			}
			return profile.Release();
		}

		function characterAdded(character: Model) {
			const model = character as BaseCharacter;

			const playerEntity = world.spawn(
				Client({
					player,
					document: {},
				}),
				Body({
					model,
				}),
				Renderable({
					model,
				}),
			);

			state.clients.set(player.UserId, playerEntity);
		}

		handleData();

		if (player.Character) characterAdded(player.Character);
		player.CharacterAdded.Connect(characterAdded);
	}

	Players.PlayerAdded.Connect(playerAdded);
	Players.PlayerRemoving.Connect(playerRemoving);
	for (const player of Players.GetPlayers()) {
		playerAdded(player);
	}

	const broadcaster = createBroadcaster({
		producers: slices,
		dispatch: (player, actions) => {
			Network.dispatch.server.fire(player, actions);
		},
	});

	Network.start.server.connect((player) => {
		broadcaster.start(player);
	});

	store.applyMiddleware(broadcaster.middleware);
}
