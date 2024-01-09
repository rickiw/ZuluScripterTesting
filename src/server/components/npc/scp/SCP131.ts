import { Component } from "@flamework/components";
import { OnStart, OnTick } from "@flamework/core";
import Log from "@rbxts/log";
import SimplePath from "@rbxts/simplepath";
import { PathfindService } from "server/services/PathfindService";
import { BaseSCP, BaseSCPInstance, OnPathfind, PathfindErrorType } from "../BaseSCP";

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
	lastPos?: Vector3;
	path: SimplePath;

	constructor(private pathfindService: PathfindService) {
		super();

		this.path = new SimplePath(this.instance);
		this.path.Reached.Connect(() => this.pathfindFinished());
		this.path.Blocked.Connect(() => this.pathfindBlocked());
		this.path.Error.Connect((errorType) => this.pathfindError(errorType));

		if (this.attributes.visualize) this.path.Visualize = true;
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
				task.wait(1);
				const character = player.Character;
				if (!character || !character.PrimaryPart) return false;
				this.target = player;
				this.status = "following";
				this.path.Run(character.PrimaryPart.Position);
				break;
			}
			case "following": {
				break;
			}
		}
		return true;
	}

	onTick(dt: number) {
		while (this.status === "following") {
			if (!this.target) {
				Log.Warn("SCP131 | Target is undefined but is following, probably left game");
				return;
			}
			const character = this.target.Character;
			if (!character || !character.PrimaryPart) {
				Log.Warn("SCP131 | Target character is undefined but is following, probably left game");
				return;
			}
			if (this.lastPos && this.lastPos.sub(character.PrimaryPart.Position).Magnitude < 1) {
				Log.Info("SCP131 | Target is close enough, stopping follow");
				if (this.path.Status === "Active") this.path.Stop();
				return;
			}

			Log.Info("SCP131 | Following {@Player} new position", this.target.Name);
			this.path.Run(character.PrimaryPart.Position);
			this.lastPos = character.PrimaryPart.Position;
		}
	}

	pathfindBlocked() {
		Log.Warn("SCP131 pathfinding was blocked...");
	}

	pathfindError(errorType: PathfindErrorType) {
		Log.Warn("SCP131 pathfinding errored {@Error}...", errorType);
	}

	pathfindFinished() {
		Log.Warn("SCP131 pathfinding reached goal...");
	}
}
