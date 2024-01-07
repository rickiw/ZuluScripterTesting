import Log from "@rbxts/log";
import { Proton } from "@rbxts/proton";
import { bootstrap } from "./bootstrap/bootstrap";
import { GameProvider } from "./providers/game";

Proton.awaitStart();

const gameProvider = Proton.get(GameProvider);

bootstrap().done((status) => {
	Log.Info("Bootstrap complete with status {@Status}", status);
});
