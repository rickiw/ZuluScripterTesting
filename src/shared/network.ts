import { Networking } from "@flamework/networking";
import { BaseCharacter } from "../CharacterTypes";

interface ClientToServerEvents {
	ItemDrop(Tool: Tool): void;

	// RoombaTouchpad
	RoombaExplode(): void;

	// BaseFirearm
	FireFirearm(weapon: Tool, mousePosition: Vector3): void;
	ReloadFirearm(weapon: Tool): void;
}

interface ServerToClientEvents {
	// RoombaTouchpad
	RoombaActive(chr: BaseCharacter): void;
	RoombaInactive(chr: BaseCharacter): void;
	RoombaLoaded(): void;
	RoombaUnloaded(): void;

	// AerialIndicator
	AreaEntered(title: string, desc: string): void;
}

interface ClientToServerFunctions {}

interface ServerToClientFunctions {}

export const GlobalEvents = Networking.createEvent<ClientToServerEvents, ServerToClientEvents>();
export const GlobalFunctions = Networking.createFunction<ClientToServerFunctions, ServerToClientFunctions>();
