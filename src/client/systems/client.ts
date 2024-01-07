import { World } from "@rbxts/matter";
import { Players } from "@rbxts/services";
import { ClientState } from "shared/clientState";

const player = Players.LocalPlayer;

function client(world: World, state: ClientState) {}

export = {
	priority: math.huge,
	system: client,
};
