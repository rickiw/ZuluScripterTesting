import { New } from "@rbxts/fusion";
import Log, { Logger } from "@rbxts/log";
import ProfileService from "@rbxts/profileservice";
import { Profile, ProfileStore } from "@rbxts/profileservice/globals";
import { Workspace } from "@rbxts/services";
import { defaultPlayerProfile } from "server/data";
import { PlayerProfile } from "shared/data/slices/state/saves";
import { BaseState } from "shared/state";

Log.SetLogger(Logger.configure().WriteTo(Log.RobloxOutput()).Create());

export interface ServerState extends BaseState {
	profiles: Map<Player, Profile<PlayerProfile, unknown>>;
}

const state: ServerState = {
	debug: true,
	verbose: true,
	profiles: new Map(),
};

const profileStore = ProfileService.GetProfileStore("PlayerData", defaultPlayerProfile);

interface BootstrapDataReturn {
	state: ServerState;
	profileStore: ProfileStore<PlayerProfile, unknown>;
}

export const getBootstrapData = () => {
	function runSetup() {
		New("Folder")({
			Name: "SCPs",
			Parent: Workspace,
		});
	}

	runSetup();

	return {
		state,
		profileStore,
	} as BootstrapDataReturn;
};
