export interface ClanMember {
	userId: PlayerID;
	rank: ClanRank;
}

export enum ClanRank {
	Owner = "OWNER",
	Member = "MEMBER",
}

export interface Clan {
	groupId: GroupID;
	members: ClanMember[];
	minimumWithdrawalRank: number;
	owner: PlayerID;
	bank: number;
}

export type GroupID = GroupInfo["Id"];
export type PlayerID = Player["UserId"];
