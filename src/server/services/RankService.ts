import { OnStart, Service } from "@flamework/core";
import { PlayerAdded } from "./PlayerService";

@Service()
export class RankService implements OnStart, PlayerAdded {
	onStart() {}

	playerAdded(player: Player) {}
}
