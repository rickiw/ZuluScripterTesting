import { Networking } from "@flamework/networking";
import { CharacterRigR15 } from "@rbxts/promise-character";
import { Clan, GroupId } from "./constants/clans";

interface ClientToServerEvents {
	// RoombaTouchpad
	RoombaExplode(): void;

	// BaseFirearm
	FireFirearm(weapon: Tool, mousePosition: Vector3): void;
}

interface ServerToClientEvents {
	StaminaBoostChanged(StaminaBoost: number): void;

	// RoombaTouchpad
	RoombaActive(old: CharacterRigR15): void;
	RoombaInactive(): void;
	RoombaLoaded(): void;
	RoombaUnloaded(): void;

	// AerialIndicator
	AreaEntered(title: string, description: string): void;
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
