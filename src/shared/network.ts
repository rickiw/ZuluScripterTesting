import { Networking } from "@flamework/networking";
import { Clan } from "./constants/clans";

interface ClientToServerEvents {}

interface ServerToClientEvents {
	StaminaBoostChanged(StaminaBoost: number): void;
}

export type ClanCreationStatus = "Success" | "Error" | "AlreadyExists" | "AlreadyInClan" | "NotAllowed";

interface ClientToServerFunctions {
	CreateClan(clanName: string): ClanCreationStatus;
	GetClans(): readonly Clan[];
}

interface ServerToClientFunctions {}

export const GlobalEvents = Networking.createEvent<ClientToServerEvents, ServerToClientEvents>();
export const GlobalFunctions = Networking.createFunction<ClientToServerFunctions, ServerToClientFunctions>();
