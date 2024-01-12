import { Component } from "@flamework/components";
import { ReplicatedStorage, Workspace } from "@rbxts/services";
import { RoombaCharacter } from "../../../Types";
import { BaseTouchpad, TouchpadAttributes, TouchpadInstance } from "./BaseTouchpad";

@Component({ tag: "roombaTouchpad" })
export class RoombaTouchpad extends BaseTouchpad<TouchpadAttributes, TouchpadInstance> {
	roombaCharacter: RoombaCharacter | undefined;
	roombaActive = false;

	constructor() {
		super();
	}
	spawnRoomba() {
		if (this.roombaCharacter !== undefined) return;
		const RoombaClone = ReplicatedStorage.FindFirstChild("Assets")
			?.FindFirstChild("Roomba")
			?.Clone() as RoombaCharacter;
		if (RoombaClone) {
			RoombaClone.Parent = Workspace;
			this.roombaCharacter = RoombaClone;
		}
	}
}
