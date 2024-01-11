import { BaseTouchpad, TouchpadAttributes, TouchpadInstance } from "shared/components/game/touchpad/BaseTouchpad";

export class RoombaTouchpad extends BaseTouchpad<TouchpadAttributes, TouchpadInstance> {
	constructor() {
		super();
	}

	onStart(): void {
		this.instance.Activated.Connect(() => {
			this.active = !this.active;
			if (this.active) this.activated.Fire();
			else this.deactivated.Fire();
		});
	}
}
