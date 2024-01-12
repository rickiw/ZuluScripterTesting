import { Controller, OnStart } from "@flamework/core";

@Controller()
export class RoombaController implements OnStart {
	constructor() {}

	onStart() {
		// const Comms = GlobalEvents.createClient({});
		// const Player = Players.LocalPlayer;
		// const Camera = Workspace.CurrentCamera as Camera;
		//
		// Comms.RoombaActive.connect((roomba) => {
		// 	Camera.CameraSubject = (roomba as RoombaCharacter).Humanoid;
		// });
		//
		// Comms.RoombaInactive.connect(() => {
		// 	Camera.CameraSubject = (Player.Character as PlayerCharacterR15).Humanoid;
		// });
	}
}
