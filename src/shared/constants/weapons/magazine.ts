import Signal from "@rbxts/signal";
import { MagazineConfig } from ".";

export interface IFirearmMagazine {
	configuration: MagazineConfig;
	holding: number;
}

export class FirearmMagazine implements IFirearmMagazine {
	holding: number;
	onChanged = new Signal<() => void, false>();

	constructor(public configuration: MagazineConfig) {
		this.holding = configuration.capacity;
	}

	getRemaining(): number {
		return this.holding;
	}

	getCapacity(): number {
		return this.configuration.capacity;
	}

	empty() {
		this.holding = 0;
		this.onChanged.Fire();
	}

	isEmpty() {
		return this.holding === 0;
	}

	take() {
		if (this.isEmpty()) return;
		this.holding--;
		this.onChanged.Fire();
	}
}
