import { Flamework } from "@flamework/core";
import Log, { Logger } from "@rbxts/log";
import { store } from "./store";

Log.SetLogger(Logger.configure().WriteTo(Log.RobloxOutput()).Create());

Flamework.addPaths("src/server/components");
Flamework.addPaths("src/server/services");
Flamework.addPaths("src/shared/components/game");

Flamework.ignite();

store.getActions();
