import { Networking } from "@flamework/networking";
import { Clan, GroupID } from "./constants/clans";
import { Objective, ObjectiveID } from "./store/objectives";
import { PlayerProfile } from "./utils";

export interface ClientToServerEvents {
	// RoombaTouchpad
	RoombaExplode(): void;

	// BaseFirearm
	ReloadFirearm(weapon: Tool): void;
	FireFirearm(weapon: Tool, mousePosition: Vector3): void;

	// Objectives
	StopObjective(objectiveId: ObjectiveID): void;
}

export interface ServerToClientEvents {
	StaminaBoostChanged(StaminaBoost: number): void;
	ToggleBeacon(objectiveName: string, toggled: boolean): void;
	SetProfile(profile: PlayerProfile): void;
	SetActiveObjective(objective: Objective | undefined): void;
	ToggleCollision(instance: Instance, toggled: boolean): void;

	// RoombaTouchpad
	RoombaActive(chr: BaseCharacter): void;
	RoombaInactive(chr: BaseCharacter): void;
	RoombaLoaded(): void;
	RoombaUnloaded(): void;

	// AerialIndicator
	AreaEntered(title: string, description: string): void;
}

export type BaseResponseStatus = "Success" | "Error";
export type ClanJoinStatus = BaseResponseStatus | "AlreadyInClan" | "NotInGroup";
export type ClanCreationStatus = BaseResponseStatus | "AlreadyExists" | "AlreadyInClan" | "NotAllowed";
export type ClanDepositStatus = BaseResponseStatus | "NotInClan" | "InsufficientBalance";
export type ClanWithdrawStatus = BaseResponseStatus | "NotInClan" | "InsufficientBalance" | "NotAllowed";

interface ClientToServerFunctions {
	CreateClan(groupId: GroupID): ClanCreationStatus;
	JoinClan(groupId: GroupID): ClanJoinStatus;
	DepositClanFunds(amount: number): ClanDepositStatus;
	WithdrawClanFunds(amount: number): ClanWithdrawStatus;
	GetClans(): readonly Clan[];
	IngestFood(food: Tool): boolean;
	BeginObjective(objectiveId: ObjectiveID): false | Objective;
}

interface ServerToClientFunctions {}

export const GlobalEvents = Networking.createEvent<ClientToServerEvents, ServerToClientEvents>();
export const GlobalFunctions = Networking.createFunction<ClientToServerFunctions, ServerToClientFunctions>();
