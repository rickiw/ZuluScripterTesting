import { Component } from "@flamework/components";
import { OnStart, OnTick } from "@flamework/core";
import { Players, ReplicatedStorage, Workspace } from "@rbxts/services";
import { setTimeout } from "@rbxts/set-timeout";
import { BaseSCP, BaseSCPInstance, MoveStatus } from "./BaseSCP";

const DAMAGE = 30;

interface SCPInstance extends BaseSCPInstance {
	Humanoid: Humanoid;
}
interface SCPAttributes {}

const filter = (c: BaseCharacter) =>
	c.Humanoid.Health > 0 && !((c.Humanoid.GetAttribute("Infected") as boolean | undefined) ?? false);
const model = ReplicatedStorage.FindFirstChild<Model>("SCP610")!;

@Component({
	defaults: {},
	tag: "SCP610",
})
export class SCP610<A extends SCPAttributes, I extends SCPInstance> extends BaseSCP<A, I> implements OnStart, OnTick {
	target: BaseCharacter | undefined = undefined;
	attackCooldown = false;
	roaring = false;
	animations = this.loadAnimations({
		walk: { id: "rbxassetid://16771610670", Looped: true, Priority: Enum.AnimationPriority.Movement },
		idle: { id: "rbxassetid://16561924669", Looped: true, Priority: Enum.AnimationPriority.Idle },
		hit: { id: "rbxassetid://16573000397", Looped: false, Priority: Enum.AnimationPriority.Action },
		run: { id: "rbxassetid://16771595130", Looped: true, Priority: Enum.AnimationPriority.Movement },
		roar: { id: "rbxassetid://16771620019", Looped: false, Priority: Enum.AnimationPriority.Action },
	});

	onStart() {
		super.onStart();

		const { animations } = this;

		this.instance.Humanoid.Running.Connect((speed) => {
			if (speed > 6) {
				animations.idle.Stop();

				if (this.target) {
					animations.run.Play();
				} else {
					animations.walk.Play();
				}
			} else {
				animations.run.Stop();
				animations.walk.Stop();
				animations.idle.Play();
			}
		});
	}

	onTick(dt: number) {
		if (this.roaring) {
			return;
		}

		const [player, distance] = this.findNearestPlayer({ distance: 0, filter });
		this.target = player;

		if (!this.target) {
			this.idle();

			return;
		}

		if (distance < 7) {
			if (this.movement !== MoveStatus.None) {
				this.stopMove();
			}
			if (!this.attackCooldown) {
				this.attack();
			}

			return;
		}

		setTimeout(() => this.roar(), math.random() * 30);
		this.chasePlayer(this.target);
	}

	attack() {
		const animation = this.animations.hit;
		const player = this.target!;

		this.attackCooldown = true;

		animation.Play();
		task.wait(animation.Length);
		animation.Stop();

		// eslint-disable-next-line no-empty
		if (player.Humanoid.Health - DAMAGE <= 0 && this.tryInfect(player)) {
		} else {
			player.Humanoid.Health -= DAMAGE;
		}
		this.attackCooldown = false;
	}

	roar() {
		this.stopMove();
		this.roaring = true;
		this.animations.roar.Play();
		this.animations.roar.Stopped.Wait();
		this.roaring = false;
	}

	tryInfect(character: BaseCharacter) {
		if (math.random() >= 0.5) {
			const player = Players.GetPlayerFromCharacter(character)!;
			const charClone = model.Clone();

			const humanoidRootPart = character.FindFirstChild<Part>("HumanoidRootPart")!;
			const humanoPosition = humanoidRootPart.Position;

			charClone.Name = player.Name;
			player.Character = charClone;

			const newHumanoidRootPart = charClone.FindFirstChild<Part>("HumanoidRootPart")!;

			if (newHumanoidRootPart && humanoPosition) {
				newHumanoidRootPart.Position = humanoPosition;
			}

			charClone.Parent = Workspace;

			return true;
		} else {
			return false;
		}
	}
}
