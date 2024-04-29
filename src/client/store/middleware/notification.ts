import { ProducerMiddleware } from "@rbxts/reflex";
import { NotificationState } from "../notifications";

export const notificationMiddleware: ProducerMiddleware<NotificationState, any> = (producer) => {
	producer.subscribe((state) => {
		print("next state:", state);
	});

	return (nextAction, name) => {
		return (...args) => {
			print(`dispatching ${name}:`, ...args);
			return nextAction(...args);
		};
	};
};
