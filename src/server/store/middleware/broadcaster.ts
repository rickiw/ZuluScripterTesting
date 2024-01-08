import { createBroadcaster, ProducerMiddleware } from "@rbxts/reflex";
import { slices } from "shared/data";
import { server } from "shared/remotes";

const broadcast = server.Get("broadcast");

export function broadcasterMiddleware(): ProducerMiddleware {
	const broadcaster = createBroadcaster({
		producers: slices,
		dispatch: (player, actions) => {
			broadcast.SendToPlayer(player, actions);
		},
	});
	server.OnEvent("start", (player) => {
		broadcaster.start(player);
	});
	return broadcaster.middleware;
}
