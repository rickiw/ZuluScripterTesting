import { Networking } from "@flamework/networking";

interface ClientToServerEvents {
	ItemDrop(Tool: Tool): void;
}

interface ServerToClientEvents {
	RoombaActive(roomba: Model): void;
	RoombaInactive(roomba: Model): void;
}

interface ClientToServerFunctions {}

interface ServerToClientFunctions {}

export const GlobalEvents = Networking.createEvent<ClientToServerEvents, ServerToClientEvents>();
export const GlobalFunctions = Networking.createFunction<ClientToServerFunctions, ServerToClientFunctions>();
