import { Component } from "@flamework/components";
import { OnStart, OnTick } from "@flamework/core";
import { BaseSCP, BaseSCPInstance, MoveStatus } from "./BaseSCP";

interface SCPInstance extends BaseSCPInstance {
	Humanoid: Humanoid;
}
interface SCPAttributes {}

const filter = (c: BaseCharacter) => c.Humanoid.Health > 0;

@Component({
	defaults: {},
	tag: "SCP939",
})
export class SCP939<A extends SCPAttributes, I extends SCPInstance> extends BaseSCP<A, I> implements OnStart, OnTick {
	attackCooldown = false;
	target: BaseCharacter | undefined = undefined;
	animations = this.loadAnimations({
		walk: { id: "rbxassetid://16601570307", Looped: true, Priority: Enum.AnimationPriority.Movement },
		run: { id: "rbxassetid://16601562615", Looped: true, Priority: Enum.AnimationPriority.Movement },
		idle: { id: "rbxassetid://16601770304", Looped: true, Priority: Enum.AnimationPriority.Idle },
		attack1: { id: "rbxassetid://16601541433", Looped: false, Priority: Enum.AnimationPriority.Action },
		attack2: { id: "rbxassetid://16601549749", Looped: false, Priority: Enum.AnimationPriority.Action },
	});

	onStart() {
		super.onStart();

		const { animations } = this;

		this.instance.Humanoid.Running.Connect((speed) => {
			if (speed > 0) {
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
		const [player, distance] = this.findNearestPlayer({ distance: 100, filter });
		this.target = player;

		if (!this.target) {
			this.idle();

			return;
		}

		if (distance < 5) {
			if (this.movement !== MoveStatus.None) {
				this.stopMove();
			}
			if (!this.attackCooldown) {
				this.attack();
			}

			return;
		}

		this.chasePlayer(this.target);
	}

	attack() {
		const animation = math.random() >= 0.5 ? this.animations.attack1 : this.animations.attack2;
		const player = this.target!;

		this.attackCooldown = true;
		animation.Play();
		player.Humanoid.Health -= 10;
		task.wait(animation.Length);
		this.attackCooldown = false;
	}
}
