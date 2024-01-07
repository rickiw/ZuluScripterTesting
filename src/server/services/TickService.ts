import { Modding, OnStart, Service } from "@flamework/core";
import { setInterval } from "@rbxts/set-timeout";

export interface On5SecondInterval {
	on5SecondInterval(): void;
}

export interface On1SecondInterval {
	on1SecondInterval(): void;
}

@Service()
export class TickService implements OnStart {
	constructor() {}

	onStart() {
		const on1SecondIntervalListeners = new Set<On1SecondInterval>();
		Modding.onListenerAdded<On1SecondInterval>((object) => on1SecondIntervalListeners.add(object));
		Modding.onListenerRemoved<On1SecondInterval>((object) => on1SecondIntervalListeners.delete(object));

		const on5SecondIntervalListeners = new Set<On5SecondInterval>();
		Modding.onListenerAdded<On5SecondInterval>((object) => on5SecondIntervalListeners.add(object));
		Modding.onListenerRemoved<On5SecondInterval>((object) => on5SecondIntervalListeners.delete(object));

		setInterval(() => {
			for (const listener of on5SecondIntervalListeners) {
				task.spawn(() => listener.on5SecondInterval());
			}
		}, 5);
		setInterval(() => {
			for (const listener of on1SecondIntervalListeners) {
				task.spawn(() => listener.on1SecondInterval());
			}
		}, 1);
	}
}
