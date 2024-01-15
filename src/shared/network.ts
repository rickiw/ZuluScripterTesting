import { Networking } from "@flamework/networking";

interface ClientToServerEvents {
	ItemDrop(Tool: Tool): void;
}

interface ServerToClientEvents {
	StaminaBoostChanged(StaminaBoost: number): void;
}

interface ClientToServerFunctions {}

interface ServerToClientFunctions {}

export const GlobalEvents = Networking.createEvent<ClientToServerEvents, ServerToClientEvents>();
export const GlobalFunctions = Networking.createFunction<ClientToServerFunctions, ServerToClientFunctions>();
