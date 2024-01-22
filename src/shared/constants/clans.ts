export interface ClanMember {
	userId: Player["UserId"];
	rank: ClanRank;
}

export enum ClanRank {
	Owner = "OWNER",
	Admin = "ADMIN",
	Member = "MEMBER",
}

export interface Clan {
	title: string;
	members: ClanMember[];
	owner: Player["UserId"];
	bank: number;
}
