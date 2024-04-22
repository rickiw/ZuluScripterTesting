import { Networking } from "@flamework/networking";
import { Clan, GroupID } from "./constants/clans";
import { FacilityAlarmCode, FacilityAnnouncement } from "./constants/os";
import { IModification } from "./constants/weapons";
import { Objective, ObjectiveID } from "./store/objectives";
import { TeamAbbreviation } from "./store/teams";
import { PlayerProfile } from "./utils";

export interface ClientToServerEvents {
	// RoombaTouchpad
	RoombaExplode(): void;

	// BaseFirearm
	ReloadFirearm(weapon: Tool): void;

	UnequipFirearm(weapon: Tool): void;
	CookFood(food: string): void;
	Help(): void;
	UpdateFirearm(weapon: Tool, modifications: IModification[]): void;

	// Objectives
	StopObjective(objectiveId: ObjectiveID): void;
}

export interface ServerToClientEvents {
	StaminaBoostChanged(StaminaBoost: number): void;
	SetProfile(profile: PlayerProfile): void;
	SetActiveObjective(objective: Objective | undefined): void;
	ToggleCollision(instance: Instance, toggled: boolean): void;
	ToggleCookMenu(): void;
	SetWeaponInfo(weaponName: string, ammo: number, reserve: number, override?: boolean): void;

	// RoombaTouchpad
	RoombaActive(chr: BaseCharacter): void;
	RoombaInactive(chr: BaseCharacter): void;
	RoombaLoaded(): void;
	RoombaUnloaded(): void;

	PlayHitmarker: Networking.Unreliable<() => void>;
	EnemyKilled(): void;

	// AerialIndicator
	AreaEntered(title: string, description: string): void;
}

interface ClientToServerFunctions {
	CreateClan(groupId: GroupID): ClanCreationStatus;
	JoinClan(groupId: GroupID): ClanJoinStatus;
	DepositClanFunds(amount: number): ClanDepositStatus;
	WithdrawClanFunds(amount: number): ClanWithdrawStatus;
	GetClans(): readonly Clan[];
	IngestFood(food: Tool): boolean;
	FireFirearm(weapon: Tool, mousePosition: Vector3): boolean;
	BeginObjective(objectiveId: ObjectiveID): false | Objective;
	EquipFirearm(weapon: Tool): Tool | undefined;
	JoinTeam(team: TeamAbbreviation): boolean;

	// OS
	// FILE SYSTEM
	CreateDocument(filename: string): boolean;
	DeleteDocument(filename: string): boolean;
	EditDocument(filename: string, contents: string): boolean;
	// FACILITY
	TogglePower(): boolean;
	ToggleHume(): boolean;
	ToggleSeismic(): boolean;
	// AUDIO
	SetAlarm(alarm: FacilityAlarmCode): boolean;
	ClearAlarm(): boolean;
	SetAnnouncement(announcement: FacilityAnnouncement): boolean;
	ClearAnnouncement(): boolean;
	// SECTOR
	SetSectorStatus(sector: string, status: string): boolean;
	// POWER
	SetTeslaGateStatus(gate: string, active: boolean): boolean;
	SetDoorStatus(door: string, active: boolean): boolean;
}

interface ServerToClientFunctions {}

export const GlobalEvents = Networking.createEvent<ClientToServerEvents, ServerToClientEvents>();
export const GlobalFunctions = Networking.createFunction<ClientToServerFunctions, ServerToClientFunctions>();
