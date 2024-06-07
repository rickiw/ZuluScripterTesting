import { Component, Components } from "@flamework/components";
import { Dependency, Modding, OnStart } from "@flamework/core";
import Maid from "@rbxts/maid";
import { Workspace } from "@rbxts/services";
import { BaseInteraction, OnInteract } from "shared/components/BaseInteraction";
import { BaseNPC } from "../npc/BaseNPC";

export interface BaseSCPInstance extends Model {}

export interface SCPAttributes {}

export interface OnWaypointReached {
	waypointReached(agent: Model, lastWaypoint: Vector3, nextWaypoint: Vector3): void;
}

export type PathfindErrorType = "LimitReached" | "TargetUnreachable" | "ComputationError" | "AgentStuck";

export enum MoveStatus {
	None,
	Walking,
	Running,
}

export interface OnPathfind {
	pathfindFinished(): void;
	pathfindBlocked(): void;
	pathfindError(error: PathfindErrorType): void;
}

export interface SCPRemoving {
	scpRemoving(scp: BaseSCPInstance): void;
}

export interface SCPAdded {
	scpAdded(scp: BaseSCPInstance): void;
}

@Component({
	defaults: {},
	tag: "baseSCP",
})
export class BaseSCP<A extends SCPAttributes, I extends BaseSCPInstance>
	extends BaseNPC<A, I>
	implements OnStart, OnInteract
{
	maid: Maid;
	interactComponents: BaseInteraction<any, any>[];
	movement = MoveStatus.None;

	constructor() {
		super();

		this.maid = new Maid();
		this.interactComponents = [];
	}

	bootstrap() {
		const components = Dependency<Components>();

		for (const value of this.instance.GetDescendants()) {
			if (value.HasTag("baseInteraction")) {
				const interactionComponent = components.getComponent<BaseInteraction<any, any>>(value);
				if (interactionComponent) {
					this.interactComponents.push(interactionComponent);
					this.maid.GiveTask(
						interactionComponent.activated.Connect((player: Player) => this.onInteract(player)),
					);
				}
			}
		}
	}

	onInteract(player: Player, prompt?: ProximityPrompt | undefined) {
		return true;
	}

	findNearestPlayer(opts: { distance?: number; filter: (child: BaseCharacter) => boolean }) {
		let nearestPlayer: BaseCharacter | undefined = undefined;
		let nearestDistance = opts.distance ?? 1000;

		const eachChildren = (child: Instance) => {
			if (!child.IsA("Model") || child.Name === this.instance.Name) {
				return;
			}

			const humanoidRootPart = child.FindFirstChild("HumanoidRootPart");
			if (!humanoidRootPart || !humanoidRootPart.IsA("BasePart")) {
				return;
			}

			if (!opts.filter(child as BaseCharacter)) {
				return;
			}
			const distance = humanoidRootPart.Position.sub(
				(this.instance.FindFirstChild("HumanoidRootPart") as BasePart).Position,
			).Magnitude;

			if (distance < nearestDistance) {
				nearestPlayer = child as BaseCharacter;
				nearestDistance = distance;
			}
		};

		for (const child of Workspace.GetChildren()) {
			eachChildren(child);
		}

		return $tuple(nearestPlayer as BaseCharacter | undefined, nearestDistance);
	}

	moveRandomly() {
		const humanoid = this.instance.FindFirstChildOfClass("Humanoid")!;
		const humanoidRootPart = this.instance.FindFirstChild("HumanoidRootPart") as BasePart;

		const currentPosition = humanoidRootPart.Position;
		const randomPosition = new Vector3(
			currentPosition.X * 2 * math.random(),
			currentPosition.Y,
			currentPosition.Z * 2 * math.random(),
		);

		this.movement = MoveStatus.Walking;
		humanoid.WalkSpeed /= 2;
		humanoid.MoveTo(randomPosition);

		task.spawn(() => {
			humanoid.MoveToFinished.Wait();
			humanoid.WalkSpeed *= 2;
			this.movement = MoveStatus.None;
		});
	}

	stopMove() {
		const humanoidRootPart = this.instance.FindFirstChild("HumanoidRootPart") as BasePart;
		this.instance.FindFirstChildOfClass("Humanoid")!.MoveTo(humanoidRootPart.Position);

		this.movement = MoveStatus.None;
	}

	loadAnimations(animations: { [key: string]: { id: string; Looped: boolean; Priority: Enum.AnimationPriority } }) {
		const animator = this.instance.FindFirstChildOfClass("Humanoid")!.FindFirstChildOfClass("Animator")!;
		const obj: { [key: string]: any } = {};

		// eslint-disable-next-line roblox-ts/no-array-pairs
		for (const [key, value] of pairs(animations)) {
			const animation = new Instance("Animation");
			animation.AnimationId = value.id;

			const animationTrack = animator.LoadAnimation(animation);
			animationTrack.Priority = value.Priority;
			animationTrack.Looped = value.Looped;

			obj[key] = animationTrack;
		}

		return obj as { [key in keyof typeof animations]: AnimationTrack };
	}

	chasePlayer(player: BaseCharacter) {
		this.movement = MoveStatus.Running;
		this.instance.FindFirstChildOfClass("Humanoid")!.MoveTo(player.HumanoidRootPart.Position);
		this.instance.FindFirstChildOfClass("Humanoid")!.MoveToFinished.Wait();
		this.movement = MoveStatus.None;
	}

	private _idle = false;
	idle() {
		if (this._idle) {
			return;
		}

		if (this.movement !== MoveStatus.None) {
			this.stopMove();
		}
		this.moveRandomly();

		this._idle = true;
		task.wait(math.random() * 15);
		this._idle = false;
	}

	sendInteractionMessage(player: Player, message: string) {
		for (const interact of this.interactComponents) {
			interact.messageReceived.Fire(player, message);
		}
	}

	onStart() {
		this.bootstrap();

		const scpAddedListeners = new Set<SCPAdded>();
		Modding.onListenerAdded<SCPAdded>((object) => scpAddedListeners.add(object));
		Modding.onListenerRemoved<SCPAdded>((object) => scpAddedListeners.delete(object));
		for (const listener of scpAddedListeners) {
			task.spawn(() => listener.scpAdded(this.instance));
		}

		const scpRemovingListeners = new Set<SCPRemoving>();
		Modding.onListenerAdded<SCPRemoving>((object) => scpRemovingListeners.add(object));
		Modding.onListenerRemoved<SCPRemoving>((object) => scpRemovingListeners.delete(object));
		this.maid.GiveTask(
			this.instance.AncestryChanged.Connect(() => {
				if (this.instance.Parent === undefined) {
					for (const listener of scpRemovingListeners) {
						task.spawn(() => listener.scpRemoving(this.instance));
					}
				}
			}),
		);
	}
}
