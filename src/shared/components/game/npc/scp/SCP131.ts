import { Component } from "@flamework/components";
import { OnStart, OnTick } from "@flamework/core";
import Log from "@rbxts/log";
import { BaseSCP, BaseSCPInstance } from "../BaseSCP";

interface SCPInstance extends BaseSCPInstance {}

interface SCPAttributes {}

@Component({
	defaults: {},
	tag: "SCP131",
})
export class SCP131<A extends SCPAttributes, I extends SCPInstance> extends BaseSCP<A, I> implements OnStart, OnTick {
	status: "idle" | "wandering" | "following" = "idle";
	target?: Player;

	constructor() {
		super();
	}

	onStart() {
		super.onStart();
		this.status = "wandering";
		Log.Warn("SCP131 started");
	}

	onInteract(player: Player, prompt?: ProximityPrompt | undefined): boolean {
		switch (this.status) {
			case "idle":
			case "wandering": {
				this.status = "following";
				this.target = player;
				Log.Warn("SCP131 following {@Player} now", this.target.Name);
				break;
			}
			case "following": {
				this.target = undefined;
				this.status = "wandering";
				Log.Warn("SCP131 stopped following {@Player}", player.Name);
				break;
			}
		}
		return true;
	}

	onTick(dt: number) {}
}
