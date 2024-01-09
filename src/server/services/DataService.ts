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

// TODO: consider moving away from ProfileService

type ProfileInstance = Profile<PlayerProfile>;

@Service()
export class DataService implements PlayerAdded, PlayerRemoving {
	private profileStorage = new Map<Player["UserId"], ProfileInstance>();

	private profileStore: ProfileStore<PlayerProfile>;

	constructor() {
		// FIXME: PLAYER_DATA_KEY should not be a shared constant
		this.profileStore = ProfileService.GetProfileStore(PLAYER_DATA_KEY, defaultPlayerProfile);
	}

	private async loadProfile(player: Player) {
		const startTick = os.clock();

		Log.Verbose("{@Player} has joined and data is being requested.", player.Name);

		// FIXME: don't use ForceLoad
		const profile = this.profileStore.LoadProfileAsync("Player_" + player.UserId, "ForceLoad");
		assert(profile, "profile is undefined!");

		Log.Verbose("{@Player} data has loaded. Took {@Time}ms", player.Name, math.abs(startTick - os.clock()));

		if (!player.IsDescendantOf(Players)) {
			profile.Release();
			throw "user left during data load!";
		}

		profile.AddUserId(player.UserId);

		profile.Reconcile();

		this.profileStorage.set(player.UserId, profile);

		profile.ListenToRelease(() => {
			this.profileStorage.delete(player.UserId);
			player.Kick("Session was terminated");
		});

		store.setPlayerSave(player.UserId, profile.Data);

		const selectPlayerData = selectPlayerSave(player.UserId);
		store.subscribe(selectPlayerData, (data, oldData) => {
			if (!data || !oldData) return;
			profile.Data = data;
		});
	}

	async playerAdded(player: Player) {
		try {
			await this.loadProfile(player);
		} catch (err) {
			Log.Warn("Failed to load profile for {name} ({id})", player.Name, player.UserId);
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
