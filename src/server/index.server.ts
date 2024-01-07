import Log from "@rbxts/log";
import { Proton } from "@rbxts/proton";
import { bootstrap } from "./bootstrap/bootstrap";

Proton.awaitStart();

bootstrap().done((status) => {
	Log.Info("Bootstrap complete with status {@Status}", status);
});
