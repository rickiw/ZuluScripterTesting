import { OnStart, Service } from "@flamework/core";
import { Functions } from "server/network";
import { serverStore } from "server/store";
import { PlayerAdded } from "./PlayerService";

@Service()
export class TeamService implements OnStart, PlayerAdded {
	onStart() {
		Functions.JoinTeam.setCallback((player, team) => {
			serverStore.setPlayerTeam(player, team);
			return true;
		});
	}

	playerAdded(player: Player) {
		serverStore.setPlayerTeam(player, "FP");
	}

	initEvents() {}
}
