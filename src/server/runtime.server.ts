import { Flamework } from "@flamework/core";
import Log from "@rbxts/log";
import { bootstrap } from "./bootstrap/bootstrap";
import { store } from "./store";

Flamework.addPaths("src/server/components");
Flamework.addPaths("src/server/services");
Flamework.addPaths("src/shared/components/game");

Log.Warn("Igniting Flamework");

Flamework.ignite();

store.getActions();

bootstrap().done((status) => {
	Log.Info("Bootstrap complete with status {@Status}", status);
});
