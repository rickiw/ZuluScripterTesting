import { Networking } from "@flamework/networking";

interface ClientToServerEvents {
	ItemDrop(Tool: Tool): void;
}

interface ServerToClientEvents {
	StaminaBoostChanged(StaminaBoost: number): void;
}

export type ClanCreationStatus = "Success" | "Error" | "AlreadyExists" | "AlreadyInClan" | "NotAllowed";

interface ClientToServerFunctions {
	CreateClan(clanName: string): ClanCreationStatus;
}

interface ServerToClientFunctions {}

export const GlobalEvents = Networking.createEvent<ClientToServerEvents, ServerToClientEvents>();
export const GlobalFunctions = Networking.createFunction<ClientToServerFunctions, ServerToClientFunctions>();
