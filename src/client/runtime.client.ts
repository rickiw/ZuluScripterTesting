import { Flamework } from "@flamework/core";
import Log from "@rbxts/log";
import { bootstrap } from "./bootstrap/bootstrap";

Flamework.addPaths("src/client/components");
Flamework.addPaths("src/client/controllers");
Flamework.addPaths("src/shared/components/game");
Flamework.addPaths("src/shared/components/game/door");

Flamework.ignite();

bootstrap()
	.done((status) => {
		Log.Info("Client Bootstrap complete with status {@Status}", status);
	})
	.catch(Log.Error);
