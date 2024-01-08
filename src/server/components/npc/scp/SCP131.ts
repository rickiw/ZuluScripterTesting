import { Component } from "@flamework/components";
import { OnStart, OnTick } from "@flamework/core";
import Log from "@rbxts/log";
import SimplePath from "@rbxts/simplepath";
import { PathfindService } from "server/services/PathfindService";
import { BaseSCP, BaseSCPInstance, OnPathfind } from "../BaseSCP";

interface SCPInstance extends BaseSCPInstance {
	Humanoid: Humanoid;
}

interface SCPAttributes {
	visualize?: boolean;
}

@Component({
	defaults: {
		visualize: true,
	},
	tag: "SCP131",
})
export class SCP131<A extends SCPAttributes, I extends SCPInstance>
	extends BaseSCP<A, I>
	implements OnStart, OnTick, OnPathfind
{
	status: "idle" | "wandering" | "following" = "idle";
	target?: Player;
	path: SimplePath;

	constructor(private pathfindService: PathfindService) {
		super();
		pathfindService.getPathfind();

		Log.Info(
			"{@children} = children",
			this.instance
				.GetChildren()
				.map((c) => c.Name)
				.join(", "),
		);

		this.path = new SimplePath(this.instance);
		this.path.Reached.Connect(() => this.pathfindFinished());
		this.path.Blocked.Connect(() => this.pathfindBlocked());
		this.path.Error.Connect(() => this.pathfindError());

		if (this.attributes.visualize) this.path.Visualize = true;
	}

	onStart() {
		super.onStart();
		this.status = "wandering";

		Log.Warn("SCP131 started");
	}

	onInteract(player: Player, prompt?: ProximityPrompt | undefined): boolean {
		Log.Info("Interacted with");
		return true;
	}

	onTick(dt: number) {}

	pathfindBlocked() {
		Log.Warn("SCP131 pathfinding was blocked...");
	}

	pathfindError() {
		Log.Warn("SCP131 pathfinding errored...");
	}

	pathfindFinished() {
		Log.Warn("SCP131 pathfinding reached goal...");
	}
}
