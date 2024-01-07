import { RunService } from "@rbxts/services";

export const IS_EDIT = RunService.IsStudio() && !RunService.IsRunning();

export const PLAYER_DATA_KEY = "V1";
export const GLOBAL_SERVER_DATA_KEY = "V1";
