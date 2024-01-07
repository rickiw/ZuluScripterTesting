import { AnyEntity } from "@rbxts/matter";

export interface BaseState {
	debug: boolean;
	verbose?: boolean;
}

export interface ClientState extends BaseState {
	playerId: AnyEntity | undefined;
	entityIdMap: Map<string, AnyEntity>;
}
