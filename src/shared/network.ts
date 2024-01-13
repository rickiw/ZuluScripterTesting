import { Networking } from "@flamework/networking";
import { PlayerCharacterR15 } from "../CharacterTypes";

interface ClientToServerEvents {
	ItemDrop(Tool: Tool): void;
	RoombaExplode(): void;
}

interface ServerToClientEvents {
	RoombaActive(old: PlayerCharacterR15): void;
	RoombaInactive(): void;
	RoombaCooldown(time: number): void;
	RoombaLoaded(): void;
	RoombaUnloaded(): void;
}

interface ClientToServerFunctions {}

interface ServerToClientFunctions {}

export const GlobalEvents = Networking.createEvent<ClientToServerEvents, ServerToClientEvents>();
export const GlobalFunctions = Networking.createFunction<ClientToServerFunctions, ServerToClientFunctions>();
