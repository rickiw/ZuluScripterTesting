import { BaseComponent, Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { Functions } from "client/network";
import { clientStore } from "client/store";

export interface FoodItemAttributes {
	activateSound: boolean;
	cooldown: boolean;
	cooldownTime: number;
	durability: number;
	recoveryType: "hunger" | "thirst" | "health";
	recoveryAmount: number;
}

export interface FoodItemInstance extends Tool {
	ActivateSound?: Sound;
}

@Component({
	tag: "foodItem",
	defaults: {
		activateSound: false,
		cooldown: false,
		cooldownTime: 1,
		durability: 5,
	},
})
export class BaseFoodItems<A extends FoodItemAttributes, I extends FoodItemInstance>
	extends BaseComponent<A, I>
	implements OnStart
{
	enabled = true;

	onStart() {
		this.instance.GetAttributeChangedSignal("cooldown").Connect(() => {
			this.enabled = !this.instance.GetAttribute("cooldown") as boolean;
		});
		this.instance.Activated.Connect(() => {
			if (!this.enabled) {
				return;
			}
			if (this.attributes.activateSound) {
				this.instance.ActivateSound!.Play();
			}

			const ingested = Functions.IngestFood.invoke(this.instance).expect();
			assert(ingested, "Failed to ingest food");

			task.wait(this.attributes.cooldownTime ?? 0.8);

			switch (this.attributes.recoveryType) {
				case "hunger":
					clientStore.incrementHunger(this.attributes.recoveryAmount);
					break;
				case "thirst":
					clientStore.incrementThirst(this.attributes.recoveryAmount);
					break;
				case "health":
					break;
			}
		});
	}
}
