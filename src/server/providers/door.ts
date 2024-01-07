import { Provider } from "@rbxts/proton";
import { Workspace } from "@rbxts/services";

function doorNameToType(name: string): DoorType {
	switch (name) {
		case "SingleDoor":
			return "SingleDoor";
		case "SingleGlassDoor":
			return "SingleGlassDoor";
		default:
			throw "Invalid";
	}
}

@Provider()
export class DoorProvider {
	constructor() {
		for (const baseDoor of Workspace.Doors.GetChildren()) {
			const door = doorNameToType(baseDoor.Name);
		}
	}
}
