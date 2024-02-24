import { Modding, OnStart, Service } from "@flamework/core";
import Log from "@rbxts/log";
import ProfileService from "@rbxts/profileservice";
import { Profile, ProfileStore } from "@rbxts/profileservice/globals";
import { Players } from "@rbxts/services";
import { PLAYER_DATA_KEY, defaultPlayerProfile } from "server/data";
import { Events } from "server/network";
import { serverStore } from "server/store";
import { selectPlayerSave } from "server/store/saves";
import { PlayerID } from "shared/constants/clans";
import { PlayerProfile } from "shared/utils";
import { PlayerAdded, PlayerRemoving } from "./PlayerService";

// TODO: consider moving away from ProfileService

type ProfileInstance = Profile<PlayerProfile>;

export interface PlayerDataLoaded {
	playerDataLoaded(player: Player, data: PlayerProfile): void;
}

@Service()
export class DataService implements OnStart, PlayerAdded, PlayerRemoving {
	private profileStorage = new Map<PlayerID, ProfileInstance>();

	private profileStore: ProfileStore<PlayerProfile>;
	private dataLoadedListeners = new Set<PlayerDataLoaded>();

	constructor() {
		this.profileStore = ProfileService.GetProfileStore(PLAYER_DATA_KEY, defaultPlayerProfile);
	}

	onStart() {
		Modding.onListenerAdded<PlayerDataLoaded>((object) => this.dataLoadedListeners.add(object));
		Modding.onListenerRemoved<PlayerDataLoaded>((object) => this.dataLoadedListeners.delete(object));
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

		task.spawn(() =>
			this.dataLoadedListeners.forEach((listener) => listener.playerDataLoaded(player, profile.Data)),
		);

		profile.ListenToRelease(() => {
			this.profileStorage.delete(player.UserId);
			player.Kick("Session was terminated");
		});

		if (!player.IsDescendantOf(Players)) return;
		serverStore.setPlayerSave(player.UserId, profile.Data);

		Events.SetProfile.fire(player, profile.Data);

		const selectPlayerData = selectPlayerSave(player.UserId);
		serverStore.subscribe(selectPlayerData, (data, oldData) => {
			if (!data || !oldData) return;
			profile.Data = data;
			Events.SetProfile.fire(player, profile.Data);
		});
	}

	async playerAdded(player: Player) {
		try {
			await this.loadProfile(player);
		} catch (err) {
			player.Kick("User data exception, please rejoin.");
			Log.Warn("Failed to load data for {name} ({id}): {err}", player.Name, player.UserId, err);
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
