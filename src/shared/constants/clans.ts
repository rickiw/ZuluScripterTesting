export interface ClanMember {
	userId: PlayerId;
	rank: ClanRank;
}

export enum ClanRank {
	Owner = "OWNER",
	Admin = "ADMIN",
	Member = "MEMBER",
}

export interface Clan {
	groupId: GroupId;
	members: ClanMember[];
	minimumWithdrawalRank: number;
	owner: PlayerId;
	bank: number;
}

export type GroupId = GroupInfo["Id"];
export type PlayerId = Player["UserId"];
