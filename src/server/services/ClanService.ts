import { OnStart, Service } from "@flamework/core";
import Log from "@rbxts/log";
import { DataStoreService, GroupService, MessagingService } from "@rbxts/services";
import { CLANS_DATA_KEY, GLOBAL_SERVER_DATA_KEY } from "server/data";
import { Functions } from "server/network";
import { serverStore } from "server/store";
import { selectClan, selectClans } from "server/store/clan";
import { selectPlayerSave } from "server/store/saves";
import { Clan, ClanRank, GroupID } from "shared/constants/clans";
import { PlayerProfile } from "shared/utils";
import { PlayerDataLoaded } from "./DataService";

interface ClanUpdate {
	clans: Clan[];
}

@Service()
export class ClanService implements OnStart, PlayerDataLoaded {
	private store: DataStore;

	constructor() {
		this.store = DataStoreService.GetDataStore(GLOBAL_SERVER_DATA_KEY);
	}

	onStart() {
		const clans = this.getAllClans();
		serverStore.setClans(clans);

		Functions.CreateClan.setCallback((player, groupId) => {
			return this.createClan(player, groupId);
		});
		Functions.GetClans.setCallback(() => {
			return serverStore.getState(selectClans);
		});
		Functions.DepositClanFunds.setCallback((player, amount) => {
			return this.depositClanFunds(player, amount);
		});
		Functions.WithdrawClanFunds.setCallback((player, amount) => {
			return this.withdrawClanFunds(player, amount);
		});
		Functions.JoinClan.setCallback((player, groupId) => {
			return this.joinClan(player, groupId);
		});

		MessagingService.SubscribeAsync("UpdateClans", (data) => {
			const clanData = data.Data as ClanUpdate;
			serverStore.setClans(clanData.clans);
		});
	}

	sendGlobalUpdate() {
		MessagingService.PublishAsync("UpdateClans", {
			clans: serverStore.getState(selectClans),
		});
	}

	getPlayerClan(player: Player): GroupID | undefined {
		const playerProfile = serverStore.getState(selectPlayerSave(player.UserId));
		assert(playerProfile, "Player profile not found");
		return playerProfile.clan;
	}

	depositClanFunds(player: Player, amount: number): ClanDepositStatus {
		const playerProfile = serverStore.getState(selectPlayerSave(player.UserId));
		if (!playerProfile) {
			return "Error";
		}
		const clanGroupId = playerProfile.clan;
		if (!clanGroupId) {
			return "NotInClan";
		}
		const clan = serverStore.getState(selectClan(clanGroupId));
		if (!clan) {
			return "Error";
		}
		if (playerProfile.credits < amount) {
			return "InsufficientBalance";
		}
		const newFunds = clan.bank + amount;
		const newClan: Clan = {
			...clan,
			bank: newFunds,
		};
		const clans = this.getAllClans();
		const newClans = clans.map((clan) => {
			if (clan.groupId === clanGroupId) {
				return newClan;
			}
			return clan;
		});
		this.store.SetAsync(CLANS_DATA_KEY, newClans);
		serverStore.setClanFunds(clanGroupId, newFunds);
		serverStore.updatePlayerSave(player.UserId, {
			credits: math.max(playerProfile.credits - amount, 0),
		});
		this.sendGlobalUpdate();
		return "Success";
	}

	withdrawClanFunds(player: Player, amount: number): ClanWithdrawStatus {
		const playerProfile = serverStore.getState(selectPlayerSave(player.UserId));
		if (!playerProfile) {
			return "Error";
		}
		const clanGroupId = playerProfile.clan;
		if (!clanGroupId) {
			return "NotInClan";
		}
		const clan = serverStore.getState(selectClan(clanGroupId));
		if (!clan) {
			return "Error";
		}
		const groupInfo = GroupService.GetGroupsAsync(player.UserId).find((group) => group.Id === clanGroupId);
		if (!groupInfo) {
			return "Error";
		}
		if (groupInfo.Rank < clan.minimumWithdrawalRank) {
			return "NotAllowed";
		}
		if (clan.bank < amount) {
			return "InsufficientBalance";
		}
		const newFunds = clan.bank - amount;
		const newClan: Clan = {
			...clan,
			bank: newFunds,
		};
		const clans = this.getAllClans();
		const newClans = clans.map((clan) => {
			if (clan.groupId === clanGroupId) {
				return newClan;
			}
			return clan;
		});
		this.store.SetAsync(CLANS_DATA_KEY, newClans);
		serverStore.setClanFunds(clanGroupId, newFunds);
		serverStore.updatePlayerSave(player.UserId, {
			credits: playerProfile.credits + amount,
		});
		this.sendGlobalUpdate();
		return "Success";
	}

	createClan(owner: Player, groupId: GroupID): ClanCreationStatus {
		const playerProfile = serverStore.getState(selectPlayerSave(owner.UserId));
		if (!playerProfile) {
			return "Error";
		}
		if (playerProfile.clan && playerProfile.clan !== 0) {
			return "AlreadyInClan";
		}
		const groupInfo = GroupService.GetGroupInfoAsync(groupId);
		if (groupInfo.Owner.Id !== owner.UserId) {
			return "NotAllowed";
		}
		const clans = this.getAllClans();
		if (clans.some((clan) => clan.groupId === groupId)) {
			return "AlreadyExists";
		}
		const clan: Clan = {
			bank: 0,
			groupId,
			members: [
				{
					rank: ClanRank.Owner,
					userId: owner.UserId,
				},
			],
			minimumWithdrawalRank: 100,
			owner: owner.UserId,
		};
		serverStore.updatePlayerSave(owner.UserId, {
			clan: groupId,
		});
		const newClans = [...clans, clan];
		this.store.SetAsync(CLANS_DATA_KEY, newClans);
		serverStore.setClans(newClans);
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

	private addPlayerToClan(player: Player, clanId: GroupID) {
		const clans = this.getAllClans();
		const newClans = clans.map((clan) => {
			if (clan.groupId === clanId) {
				const newClan = {
					...clan,
					members: [...clan.members, { rank: ClanRank.Member, userId: player.UserId }],
				};
				return newClan;
			}
			return clan;
		});
		this.store.SetAsync(CLANS_DATA_KEY, newClans);
		serverStore.setClans(newClans);
		this.sendGlobalUpdate();
	}

	private removePlayerFromClan(player: Player, clanId: GroupID) {
		const clans = this.getAllClans();
		const newClans = clans.map((clan) => {
			if (clan.groupId === clanId) {
				const newClan = {
					...clan,
					members: clan.members.filter((member) => member.userId !== player.UserId),
				};
				return newClan;
			}
			return clan;
		});
		this.store.SetAsync(CLANS_DATA_KEY, newClans);
		serverStore.setClans(newClans);
		this.sendGlobalUpdate();
	}

	joinClan(player: Player, clanId: GroupID): ClanJoinStatus {
		const clan = serverStore.getState(selectClan(clanId));
		if (!clan) {
			return "Error";
		}
		const isPlayerInClanGroup = GroupService.GetGroupsAsync(player.UserId).some((group) => group.Id === clanId);
		if (!isPlayerInClanGroup) {
			return "NotInGroup";
		}
		const playerProfile = serverStore.getState(selectPlayerSave(player.UserId));
		if (!playerProfile) {
			return "Error";
		}
		if (playerProfile.clan && playerProfile.clan !== 0) {
			return "AlreadyInClan";
		}
		this.addPlayerToClan(player, clanId);
		serverStore.updatePlayerSave(player.UserId, {
			clan: clanId,
		});
		return "Success";
	}

	playerDataLoaded(player: Player, data: PlayerProfile) {
		if (!data.clan) {
			return;
		}
		const clan = serverStore.getState(selectClan(data.clan));
		if (!clan) {
			Log.Warn(
				"Player {@Player} has clan {@Clan} but clan does not exist, removing players clan",
				player.Name,
				data.clan,
			);
			serverStore.updatePlayerSave(player.UserId, {
				clan: 0,
			});
			return;
		}
		const isPlayerStillInClan = GroupService.GetGroupsAsync(player.UserId).some((group) => group.Id === data.clan);
		if (!isPlayerStillInClan) {
			Log.Warn(
				"Player {@Player} has clan {@Clan} but is no longer a member of the clan group",
				player.Name,
				data.clan,
			);
			serverStore.updatePlayerSave(player.UserId, {
				clan: 0,
			});
			this.removePlayerFromClan(player, data.clan);
			return;
		}
	}
}
