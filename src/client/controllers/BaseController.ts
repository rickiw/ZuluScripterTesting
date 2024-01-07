/*
 * 2023. Braden A Jones | bradenjones.dev
 */
import { Controller, Modding, OnStart } from "@flamework/core";

import { setInterval } from "@rbxts/set-timeout";

interface PlayerCharacter extends Model {
	HumanoidRootPart: BasePart;
	Humanoid: Humanoid;
}

export interface On5SecondInterval {
	on5SecondInterval(): void;
}

export interface On1SecondInterval {
	on1SecondInterval(): void;
}

@Controller()
export class BaseController implements OnStart {
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
