import { createBroadcastReceiver, ProducerMiddleware } from "@rbxts/reflex";
import { IS_EDIT } from "shared/constants/core";
import { client } from "shared/remotes";

export function receiverMiddleware(): ProducerMiddleware {
	if (IS_EDIT) {
		return () => (dispatch) => dispatch;
	}

	const receiver = createBroadcastReceiver({
		start: () => {
			client.Get("start").SendToServer();
		},
	});
	client.Get("broadcast").Connect((actions) => {
		receiver.dispatch(actions);
	});
	return receiver.middleware;
}
