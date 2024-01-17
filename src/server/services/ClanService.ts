import { OnStart, Service } from "@flamework/core";
import Log from "@rbxts/log";
import { DataStoreService } from "@rbxts/services";
import { CLANS_DATA_KEY, GLOBAL_SERVER_DATA_KEY } from "server/data";
import { Functions } from "server/network";
import { Clan, ClanRank } from "server/store/clan/clan-slice";
import { ClanCreationStatus } from "shared/network";

@Service()
export class ClanService implements OnStart {
	private store: DataStore;

	constructor() {
		this.store = DataStoreService.GetDataStore(GLOBAL_SERVER_DATA_KEY);
	}

	onStart() {
		const clans = this.getAllClans();
		if (!clans) {
			Log.Warn("Clans data store is empty, creating empty array");
			this.createClansStore();
		}

		Functions.CreateClan.setCallback(async (player, clanName) => {
			Log.Warn("Creating clan {@ClanName}", clanName);
			return this.createClan(player, clanName);
		});
	}

	clanExists(name: string, cachedClans?: Clan[]) {
		const clans = cachedClans ?? this.getAllClans();
		const exists = clans.some((clan) => clan.title.lower() === name.lower());
		return $tuple(exists, clans);
	}

	getPlayerClan(player: Player) {
		const clans = this.getAllClans();
		return $tuple(
			clans.find((clan) => clan.members.has(player.UserId)),
			clans,
		);
	}

	createClan(owner: Player, title: string): ClanCreationStatus {
		const [playerClan, allClans] = this.getPlayerClan(owner);
		if (playerClan) {
			return "AlreadyInClan";
		}

		const [clanExists] = this.clanExists(title, allClans);
		if (clanExists) {
			return "AlreadyExists";
		}

		const members = new Map<number, ClanRank>();
		members.set(owner.UserId, ClanRank.Owner);
		const clan: Clan = {
			title,
			members,
			owner: owner.UserId,
			bank: 0,
		};

		allClans.push(clan);
		this.store.SetAsync(CLANS_DATA_KEY, allClans);
		return "Success";
	}

	private getAllClans(): Clan[] {
		const [clans] = this.store.GetAsync<Clan[]>(CLANS_DATA_KEY);
		if (!clans) {
			this.createClansStore();
			return this.getAllClans();
		}
		return clans;
	}

	private createClansStore() {
		this.store.SetAsync(CLANS_DATA_KEY, []);
	}
}
