import { Flamework } from "@flamework/core";
import Log, { Logger } from "@rbxts/log";
import { GAME_NAME } from "shared/constants/game";

Log.SetLogger(Logger.configure().WriteTo(Log.RobloxOutput()).Create());

Log.Info("{@GameName} is starting {@GameVersion}", GAME_NAME, game.PlaceVersion);

Flamework.addPaths("src/server/components");
Flamework.addPaths("src/server/services");
Flamework.addPaths("src/shared/components");

Flamework.ignite();
