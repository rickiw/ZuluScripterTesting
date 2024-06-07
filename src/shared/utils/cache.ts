import Log from "@rbxts/log";
import Signal from "@rbxts/signal";

export class CachedValue<T> {
	private value: T | undefined;

	oldValue: T | undefined;
	onChanged = new Signal<(value: T | undefined, oldValue: T | undefined) => void, false>();

	constructor() {}

	get() {
		return this.value;
	}

	set(value: T | undefined) {
		this.oldValue = this.value;
		this.value = value;
		if (this.value !== this.oldValue) {
			this.onChanged.Fire(this.value, this.oldValue);
		}
		Log.Warn("Set Value: {@Value}", this.value);
	}
}
