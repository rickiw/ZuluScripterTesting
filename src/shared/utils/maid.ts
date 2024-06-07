import Log from "@rbxts/log";
import Maid from "@rbxts/maid";
import Object from "@rbxts/object-utils";
import Signal from "@rbxts/signal";
import { Indexable } from "./array";

export class ExtendedMaidTest<T extends string> {
	connections: Indexable<T, RBXScriptConnection> = {} as Indexable<T, RBXScriptConnection>;
	threads: Array<thread> = [];

	setTask(task: T, connection: RBXScriptConnection) {
		this.connections[task] = connection;
	}

	setThread(thread: thread) {
		this.threads.push(thread);
	}

	clean() {
		for (const key of Object.keys(this.connections)) {
			Log.Warn("Disconnecting: {@Key}", key);
			this.connections[key as T].Disconnect();
		}
		this.threads.forEach((thread) => {
			Log.Warn("Killing thread");
			task.cancel(thread);
		});
	}

	hasTasks() {
		return Object.keys(this.connections).size() > 0;
	}
}

export class ExtendedMaid {
	private maid: Maid;
	private tasks = 0;

	onClean = new Signal<() => void, false>();

	constructor() {
		this.maid = new Maid();
	}

	addTask(task: Maid.Task) {
		this.maid.GiveTask(task);
		this.tasks++;
	}

	destroy() {
		this.onClean.Fire();
		this.maid.DoCleaning();
		this.tasks = 0;
	}

	hasTasks() {
		return this.tasks > 0;
	}
}
