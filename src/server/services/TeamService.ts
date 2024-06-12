import { OnStart, Service } from "@flamework/core";
import { serverStore } from "server/store";
import { PlayerAdded } from "./PlayerService";

@Service()
export class TeamService implements OnStart, PlayerAdded {
	onStart() {}

	playerAdded(player: Player) {
		serverStore.setPlayerTeam(player, "FP");
	}

	initEvents() {}
}
