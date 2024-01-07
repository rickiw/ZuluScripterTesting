import { New } from "@rbxts/fusion";
import { Players } from "@rbxts/services";
import { getBootstrapData } from "./state";

export async function bootstrap() {
	const { state, profileStore } = getBootstrapData();

	function playerRemoving(player: Player) {
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

		function characterAdded(character: Model) {}

		handleData();

		if (player.Character) characterAdded(player.Character);
		player.CharacterAdded.Connect(characterAdded);
	}

	Players.PlayerAdded.Connect(playerAdded);
	Players.PlayerRemoving.Connect(playerRemoving);
	for (const player of Players.GetPlayers()) {
		playerAdded(player);
	}
}
