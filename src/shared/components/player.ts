import { component } from "@rbxts/matter";

export const Client = component<{
	player: Player;
	document: {};
}>("Client");
export type Client = ReturnType<typeof Client>;
