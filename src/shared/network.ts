import { Networking } from "@flamework/networking";
import { Clan, GroupId } from "./constants/clans";

interface ClientToServerEvents {}

interface ServerToClientEvents {
	StaminaBoostChanged(StaminaBoost: number): void;
}

export type BaseResponseStatus = "Success" | "Error";
export type ClanCreationStatus = BaseResponseStatus | "AlreadyExists" | "AlreadyInClan" | "NotAllowed";
export type ClanDepositStatus = BaseResponseStatus | "NotInClan" | "InsufficientBalance";
export type ClanWithdrawStatus = BaseResponseStatus | "NotInClan" | "InsufficientBalance" | "NotAllowed";

interface ClientToServerFunctions {
	CreateClan(groupId: GroupId): ClanCreationStatus;
	DepositClanFunds(amount: number): ClanDepositStatus;
	WithdrawClanFunds(amount: number): ClanWithdrawStatus;
	GetClans(): readonly Clan[];
}

interface ServerToClientFunctions {}

export const GlobalEvents = Networking.createEvent<ClientToServerEvents, ServerToClientEvents>();
export const GlobalFunctions = Networking.createFunction<ClientToServerFunctions, ServerToClientFunctions>();
