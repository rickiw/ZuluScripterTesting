import { Networking } from "@flamework/networking";
import { PlayerCharacterR15 } from "../CharacterTypes";

interface ClientToServerEvents {
	ItemDrop(Tool: Tool): void;

	// RoombaTouchpad
	RoombaExplode(): void;

	// BaseFirearm
	FireFirearm(weapon: Tool, mousePosition: Vector3): void;
}

interface ServerToClientEvents {
	// RoombaTouchpad
	RoombaActive(old: PlayerCharacterR15): void;
	RoombaInactive(): void;
	RoombaLoaded(): void;
	RoombaUnloaded(): void;

	// AerialIndicator
	AreaEntered(title: string, desc: string): void;
}

interface ClientToServerFunctions {}

interface ServerToClientFunctions {}

export const GlobalEvents = Networking.createEvent<ClientToServerEvents, ServerToClientEvents>();
export const GlobalFunctions = Networking.createFunction<ClientToServerFunctions, ServerToClientFunctions>();
