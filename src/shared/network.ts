import { Networking } from "@flamework/networking";
import { Clan } from "./constants/clans";

interface ClientToServerEvents {}

interface ServerToClientEvents {
	StaminaBoostChanged(StaminaBoost: number): void;
}

export type BaseResponseStatus = "Success" | "Error";
export type ClanCreationStatus = BaseResponseStatus | "AlreadyExists" | "AlreadyInClan" | "NotAllowed";
export type ClanDepositStatus = BaseResponseStatus | "InsufficientBalance" | "NotAllowed";
export type ClanWithdrawStatus = BaseResponseStatus | "NotAllowed";

interface ClientToServerFunctions {
	CreateClan(clanName: string): ClanCreationStatus;
	DepositClanFunds(amount: number): ClanDepositStatus;
	WithdrawClanFunds(amount: number): ClanWithdrawStatus;
	GetClans(): readonly Clan[];
}

interface ServerToClientFunctions {}

export const GlobalEvents = Networking.createEvent<ClientToServerEvents, ServerToClientEvents>();
export const GlobalFunctions = Networking.createFunction<ClientToServerFunctions, ServerToClientFunctions>();
