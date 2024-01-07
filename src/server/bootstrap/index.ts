import Log, { Logger } from "@rbxts/log";
import { AnyEntity, World } from "@rbxts/matter";
import ProfileService from "@rbxts/profileservice";
import { Profile, ProfileStore } from "@rbxts/profileservice/globals";
import { ReplicatedStorage } from "@rbxts/services";
import { PlayerProfile, defaultPlayerProfile } from "server/data";
import { BaseState } from "shared/clientState";
import { setupTags } from "shared/setupTags";
import { start } from "shared/start";

Log.SetLogger(Logger.configure().WriteTo(Log.RobloxOutput()).Create());

declare const script: { Parent: Folder & { systems: Folder } };
export interface ServerState extends BaseState {
	clients: Map<number, AnyEntity>;
	profiles: Map<Player, Profile<PlayerProfile, unknown>>;
}

const state: ServerState = {
	debug: true,
	verbose: true,
	clients: new Map(),
	profiles: new Map(),
};

const world = start([script.Parent.systems, ReplicatedStorage.Shared.systems], state)(setupTags);
const profileStore = ProfileService.GetProfileStore("PlayerData", defaultPlayerProfile);

interface BootstrapDataReturn {
	world: World;
	state: ServerState;
	profileStore: ProfileStore<PlayerProfile, unknown>;
}

export const getBootstrapData = () => {
	return {
		world,
		state,
		profileStore,
	} as BootstrapDataReturn;
};
