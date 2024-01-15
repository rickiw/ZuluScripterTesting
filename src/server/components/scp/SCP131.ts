import { Component } from "@flamework/components";
import { OnStart, OnTick } from "@flamework/core";
import Log from "@rbxts/log";
import SimplePath from "@rbxts/simplepath";
import { BaseSCP, BaseSCPInstance, OnPathfind, PathfindErrorType } from "./BaseSCP";

interface SCPInstance extends BaseSCPInstance {
	Humanoid: Humanoid;
	HumanoidRootPart: BasePart;
	RoamArea: BasePart;
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
	nextWanderPoint?: Vector3;
	path: SimplePath;

	constructor() {
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
	}

	onInteract(player: Player, prompt?: ProximityPrompt | undefined): boolean {
		switch (this.status) {
			case "idle":
			case "wandering": {
				const character = player.Character;
				if (!character || !character.PrimaryPart) return false;
				this.target = player;
				this.status = "following";
				this.path.Run(character.PrimaryPart.Position);
				break;
			}
			case "following": {
				if (this.path.Status === "Active") this.path.Stop();
				this.nextWanderPoint = undefined;
				this.status = "wandering";
				break;
			}
		}
		return true;
	}

	onTick(dt: number) {
		switch (this.status) {
			case "wandering": {
				if (!this.nextWanderPoint) this.nextWanderPoint = this.getNextWanderPoint();
				if (this.path.Status !== "Active") this.path.Run(this.nextWanderPoint);
				break;
			}
			case "following": {
				if (!this.target) {
					if (this.attributes.visualize)
						Log.Warn("SCP131 | Target is undefined but is following, probably left game");
					if (this.path.Status === "Active") this.path.Stop();
					this.status = "idle";
					return;
				}
				const character = this.target.Character;
				if (!character || !character.PrimaryPart) {
					this.target = undefined;
					if (this.attributes.visualize)
						Log.Warn("SCP131 | Target character is undefined but is following, probably left game");
					if (this.path.Status === "Active") this.path.Stop();
					this.status = "idle";
					return;
				}
				if (this.lastPos && this.lastPos.sub(character.PrimaryPart.Position).Magnitude < 1) {
					return;
				}
				this.path.Run(character.PrimaryPart.Position);
				this.lastPos = character.PrimaryPart.Position;
				break;
			}
		}
	}

	pathfindBlocked() {
		if (this.attributes.visualize) Log.Warn("SCP131 pathfinding was blocked...");
		if (this.status === "wandering") {
			this.nextWanderPoint = this.getNextWanderPoint();
			this.path.Stop();
			this.path.Run(this.nextWanderPoint);
		}
	}

	fixPathfindError() {
		if (this.status !== "wandering") return;
		this.nextWanderPoint = this.getNextWanderPoint();
		this.path.Run(this.nextWanderPoint);
	}

	pathfindError(errorType: PathfindErrorType) {
		switch (errorType) {
			case "ComputationError":
			case "LimitReached":
				this.fixPathfindError();
				break;
			case "AgentStuck":
				break;
			case "TargetUnreachable":
				if (this.attributes.visualize) Log.Warn("SCP131 | Target unreachable");
				break;
		}
	}

	getRandomPositionInsideOfPart(part: BasePart, yOverride?: number) {
		const size = part.Size;
		const position = part.Position;

		const x = math.random(-size.X / 2, size.X / 2);
		const y = yOverride ?? math.random(-size.Y / 2, size.Y / 2);
		const z = math.random(-size.Z / 2, size.Z / 2);

		return new Vector3(x, y, z).add(position);
	}

	getNextWanderPoint() {
		return this.getRandomPositionInsideOfPart(this.instance.RoamArea, this.instance.HumanoidRootPart.Position.Y);
	}

	pathfindFinished() {
		if (this.status === "wandering") {
			this.status = "idle";
			task.delay(math.random(1, 3), () => {
				if (this.status !== "idle") return;
				this.nextWanderPoint = this.getNextWanderPoint();
				this.path.Run(this.nextWanderPoint);
				this.status = "wandering";
			});
		}
	}
}
