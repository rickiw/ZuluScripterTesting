import { Flamework } from "@flamework/core";
import Log from "@rbxts/log";
import { UserInputService } from "@rbxts/services";
import { bootstrap } from "./bootstrap/bootstrap";
import { Functions } from "./network";
import { clientStore } from "./store";

Flamework.addPaths("src/client/components");
Flamework.addPaths("src/client/controllers");
Flamework.addPaths("src/shared/components");

Flamework.ignite();

bootstrap();

UserInputService.InputBegan.Connect((inp) => {
	if (inp.KeyCode === Enum.KeyCode.Y) {
		const beginObjectiveResult = Functions.BeginObjective.invoke(13).expect();

		if (beginObjectiveResult === false) {
			Log.Warn("Failed to start objective");
			return;
		}

		clientStore.setActiveObjective(beginObjectiveResult);
		Log.Warn("Started: {@Started}", beginObjectiveResult);
	}
});
