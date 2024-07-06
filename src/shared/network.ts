import { Networking } from "@flamework/networking";
import { CharacterRigR15 } from "@rbxts/promise-character";
import { CharacterOptions } from "./constants/character";
import { Clan, GroupID } from "./constants/clans";
import { FacilityAlarmCode, FacilityAnnouncement } from "./constants/os";
import { IModification } from "./constants/weapons";
import { Objective, ObjectiveID } from "./store/objectives";
import { TeamAbbreviation } from "./store/teams";
import { PlayerProfile } from "./utils";

export interface ClientToServerWeaponEvents {
	ReloadFirearm(weapon: Tool): void;
	UnequipFirearm(weapon: Tool): void;
	UpdateFirearm(weapon: Tool, modifications: IModification[]): void;
}

export interface ClientToServerRoombaEvents {
	RoombaExplode(): void;
}

export interface ClientToServerCookEvents {
	CookFood(food: string): void;
}

export interface ClientToServerEvents
	extends ClientToServerWeaponEvents,
		ClientToServerRoombaEvents,
		ClientToServerCookEvents {
	// Debug | Gives 30 bullets
	Help(): void;
	HelpTwo(): void;

	// Objectives
	StopObjective(objectiveId: ObjectiveID): void;

	// Items
	ItemAction(obj: unknown): void;

	// Customization
	SetAccessories(character: CharacterRigR15, accessories: number[]): void;
}

export interface ServerToClientRoombaEvents {
	RoombaActive(chr: BaseCharacter): void;
	RoombaInactive(chr: BaseCharacter): void;
	RoombaLoaded(): void;
	RoombaUnloaded(): void;
}

export interface ServerToClientTeamEvents {
	ClassDEscape(): void;
}

export interface ServerToClientEvents extends ServerToClientRoombaEvents, ServerToClientTeamEvents {
	StaminaBoostChanged(StaminaBoost: number): void;
	SetProfile(profile: PlayerProfile): void;
	SetActiveObjective(objective: Objective | undefined): void;
	ToggleCollision(instance: Instance, toggled: boolean): void;
	ToggleCookMenu(): void;
	SetWeaponInfo(weaponName: string, ammo: number, reserve: number, override?: boolean): void;
	UnloadWeapon(): void;

	PlayHitmarker: Networking.Unreliable<() => void>;
	EnemyKilled(): void;

	// AerialIndicator
	AreaEntered(title: string, description: string): void;

	ToggleWeaponEquip(equipped: boolean): void;
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
	GetAssetAccessory(assetId: number): Accessory;
	GetCustomizationCharacter(): CharacterRigR15;
	SetCharacterCustomization(options: CharacterOptions): CharacterRigR15;

	// // OS
	// // FILE SYSTEM
	// CreateDocument(filename: string): boolean;
	// DeleteDocument(filename: string): boolean;
	// EditDocument(filename: string, contents: string): boolean;
	// // FACILITY
	// TogglePower(): boolean;
	// ToggleHume(): boolean;
	// ToggleSeismic(): boolean;
	// // AUDIO
	SetAlarm(alarm: FacilityAlarmCode): boolean;
	// ClearAlarm(): boolean;
	SetAnnouncement(announcement: FacilityAnnouncement): boolean;
	// ClearAnnouncement(): boolean;
	// // SECTOR
	// SetSectorStatus(sector: string, status: string): boolean;
	// // POWER
	SetTeslaGateStatus(gate: string, active: boolean): boolean;
	SetDoorStatus(door: string, active: boolean): boolean;
}

interface ServerToClientFunctions {
	LoadWeapon(weapon: Tool): boolean;
}

export const GlobalEvents = Networking.createEvent<ClientToServerEvents, ServerToClientEvents>();
export const GlobalFunctions = Networking.createFunction<ClientToServerFunctions, ServerToClientFunctions>();
