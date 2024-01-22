import { OnStart, Service } from "@flamework/core";
import Log from "@rbxts/log";
import { DataStoreService } from "@rbxts/services";
import { CLANS_DATA_KEY, GLOBAL_SERVER_DATA_KEY } from "server/data";
import { Functions } from "server/network";
import { serverStore } from "server/store";
import { selectClans } from "server/store/clan";
import { Clan, ClanRank } from "shared/constants/clans";
import { ClanCreationStatus, ClanDepositStatus, ClanWithdrawStatus } from "shared/network";
import { selectPlayerSave } from "shared/store/saves";

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

		serverStore.setClans(clans);

		Functions.CreateClan.setCallback((player, clanName) => {
			Log.Warn("Creating clan {@ClanName}", clanName);
			return this.createClan(player, clanName);
		});

		Functions.GetClans.setCallback((player) => {
			Log.Warn("Player {@Player} requested clans", player);
			return serverStore.getState(selectClans);
		});

		Functions.DepositClanFunds.setCallback((player, amount) => {
			return this.depositClanFunds(player, amount);
		});

		Functions.WithdrawClanFunds.setCallback((player, amount) => {
			return this.withdrawClanFunds(player, amount);
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
			clans.find(
				(clan) =>
					clan.members.some((member) => member.userId === player.UserId) || clan.owner === player.UserId,
			),
			clans,
		);
	}

	depositClanFunds(player: Player, amount: number): ClanDepositStatus {
		const [playerClan, allClans] = this.getPlayerClan(player);
		if (!playerClan) {
			return "Error";
		}
		const playerProfile = serverStore.getState(selectPlayerSave(player.UserId));
		if (!playerProfile) {
			return "Error";
		}
		if (playerProfile.credits < amount) {
			return "InsufficientBalance";
		}
		const newCredits = playerProfile.credits - amount;
		serverStore.updatePlayerSave(player.UserId, {
			credits: newCredits,
		});
		// TODO: use store and middleware instead of hacky way
		Log.Warn("Clan Bank Before: {@Bank}", playerClan.bank);
		const newAllClans = allClans.map((clan) => {
			if (clan.title === playerClan.title) {
				clan.bank += amount;
			}
			return clan;
		});
		this.store.SetAsync(CLANS_DATA_KEY, newAllClans);
		const [newPlayerClan] = this.getPlayerClan(player);
		Log.Warn("Clan Bank After: {@Bank}", newPlayerClan?.bank);
		return "Success";
	}

	withdrawClanFunds(player: Player, amount: number): ClanWithdrawStatus {
		const [playerClan, allClans] = this.getPlayerClan(player);
		if (!playerClan) {
			return "Error";
		}
		return "Success";
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

		const members = [{ userId: owner.UserId, rank: ClanRank.Owner }];
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
