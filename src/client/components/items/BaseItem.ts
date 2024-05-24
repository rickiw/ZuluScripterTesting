import { BaseComponent, Component } from "@flamework/components";
import { OnStart } from "@flamework/core";

export interface BaseItemInstance extends Tool {}

export interface BaseItemAttributes {}

@Component({
	tag: "baseItem",
})
export class BaseItem<A extends BaseItemAttributes, I extends BaseItemInstance>
	extends BaseComponent<A, I>
	implements OnStart
{
	onStart() {
		this.instance.Activated.Connect(() => {
			this.activated();
		});
	}

	activated() {}
}
