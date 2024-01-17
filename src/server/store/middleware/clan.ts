import Log from "@rbxts/log";
import { ProducerMiddleware } from "@rbxts/reflex";
import { ClanActions, ClanState } from "../clan/clan-slice";

export const clanMiddleware: ProducerMiddleware<ClanState, ClanActions> = (producer) => {
	producer.subscribe((state) => {
		Log.Warn("Next State: {@State}", state);
	});
	return (nextAction, name) => {
		return (...args) => nextAction(...args);
	};
};
