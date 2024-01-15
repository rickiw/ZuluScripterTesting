import { Networking } from "@flamework/networking";
import { PlayerCharacterR15 } from "../CharacterTypes";

interface ClientToServerEvents {
	ItemDrop(Tool: Tool): void;

	// RoombaTouchpad
	RoombaExplode(): void;
}

interface ServerToClientEvents {
	// RoombaTouchpad
	RoombaActive(old: PlayerCharacterR15): void;
	RoombaInactive(): void;
	RoombaCooldown(time: number): void;
	RoombaLoaded(): void;
	RoombaUnloaded(): void;

	// AerialIndicator
	AreaEntered(title: string, desc: string): void;
}

interface ClientToServerFunctions {
	// FirearmWeapon
	FirearmFire(weapon: Tool, mousePosition: Vector3): void;
}

interface ServerToClientFunctions {
	// FirearmWeapon
	FireProjectile(from: Vector3, direction: Vector3, velocity: number): void;
}

export const GlobalEvents = Networking.createEvent<ClientToServerEvents, ServerToClientEvents>();
export const GlobalFunctions = Networking.createFunction<ClientToServerFunctions, ServerToClientFunctions>();
