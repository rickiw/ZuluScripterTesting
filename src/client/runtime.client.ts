import { Flamework } from "@flamework/core";
import { UserInputService } from "@rbxts/services";
import { bootstrap } from "./bootstrap/bootstrap";
import { Events } from "./network";

Flamework.addPaths("src/client/components");
Flamework.addPaths("src/client/controllers");
Flamework.addPaths("src/shared/components");

Flamework.ignite();

bootstrap();

UserInputService.InputBegan.Connect((inp) => {
	if (inp.KeyCode === Enum.KeyCode.Y) {
		Events.BeginObjective.fire(11);
	}
});
