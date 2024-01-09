import { Service } from "@flamework/core";
import Log from "@rbxts/log";
import ProfileService from "@rbxts/profileservice";
import { Profile, ProfileStore } from "@rbxts/profileservice/globals";
import { Players } from "@rbxts/services";
import { defaultPlayerProfile } from "server/data";
import { store } from "server/store";
import { PLAYER_DATA_KEY } from "shared/constants/core";
import { selectPlayerSave } from "shared/data/selectors/saves";
import { PlayerProfile } from "shared/data/slices/state/saves";
import { PlayerAdded, PlayerRemoving } from "./PlayerService";

@Service()
export class DataService implements PlayerAdded, PlayerRemoving {
	profileStore: ProfileStore<PlayerProfile>;
	profileStorage: Map<number, Profile<PlayerProfile>>;

	constructor() {
		this.profileStore = ProfileService.GetProfileStore(PLAYER_DATA_KEY, defaultPlayerProfile);
		this.profileStorage = new Map();
	}

	playerAdded(player: Player) {
		const startTick = tick();
		Log.Verbose("{@Player} has joined and data is being requested.", player.Name);
		const profile = this.profileStore.LoadProfileAsync("Player_" + player.UserId, "ForceLoad");
		if (!profile) {
			player.Kick("User data exception, please rejoin.");
			return;
		}
		Log.Verbose("{@Player} data has loaded. Took {@Time}ms", player.Name, math.abs(startTick - tick()));
		profile.AddUserId(player.UserId);
		profile.Reconcile();
		profile.ListenToRelease(() => {
			if (this.profileStorage.has(player.UserId)) this.profileStorage.delete(player.UserId);
			player.Kick("Session was terminated");
		});
		if (player.IsDescendantOf(Players)) {
			this.profileStorage.set(player.UserId, profile);

			store.setPlayerSave(player.UserId, profile.Data);

			const selectPlayerData = selectPlayerSave(player.UserId);
			store.subscribe(selectPlayerData, (data, oldData) => {
				if (!data || !oldData) return;
				profile.Data = data;
			});
		} else {
			player.Kick("User data exception, please rejoin.");
		}
	}

	playerRemoving(player: Player) {
		Log.Verbose("{@Player} is leaving, closing out profile.", player.Name);

		const profile = this.profileStorage.get(player.UserId);
		if (!profile) return;

		this.profileStorage.delete(player.UserId);

		profile.Release();
	}
}
