import { BaseComponent, Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { Debris } from "@rbxts/services";

interface CacheInstance extends Folder {}

interface CacheAttributes {
	every: number;
	only?: string;
}

@Component({
	tag: "cache",
})
export class Cache<A extends CacheAttributes, I extends CacheInstance> extends BaseComponent<A, I> implements OnStart {
	onStart() {
		this.instance.ChildAdded.Connect((child) => {
			if (this.attributes.only && child.Name !== this.attributes.only) {
				return;
			}
			Debris.AddItem(child, this.attributes.every);
		});
	}
}
