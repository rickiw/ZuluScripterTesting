import { Component } from "@flamework/components";
import { OnStart, OnTick } from "@flamework/core";
import { BaseSCP, BaseSCPInstance, MoveStatus } from "./BaseSCP";

interface SCPInstance extends BaseSCPInstance {
	Humanoid: Humanoid;
}
interface SCPAttributes {}

const filter = (c: BaseCharacter) => c.Humanoid.Health > 0 && c.Humanoid.Health < c.Humanoid.MaxHealth;

@Component({
	defaults: {},
	tag: "SCP999",
})
export class SCP999<A extends SCPAttributes, I extends SCPInstance> extends BaseSCP<A, I> implements OnStart, OnTick {
	moving = false;
	healCooldown = false;
	target: BaseCharacter | undefined = undefined;
	animations = this.loadAnimations({
		walk: { id: "rbxassetid://16561937977", Looped: true, Priority: Enum.AnimationPriority.Movement },
		idle: { id: "rbxassetid://16561924669", Looped: true, Priority: Enum.AnimationPriority.Idle },
		hug: { id: "rbxassetid://16573000397", Looped: false, Priority: Enum.AnimationPriority.Action },
	});

	onStart() {
		super.onStart();

		this.instance.Humanoid.Running.Connect((speed) => {
			if (speed > 0) {
				this.animations.walk.Play();
			} else {
				this.animations.walk.Stop();
				this.animations.idle.Play();
			}
		});
	}

	onTick(dt: number) {
		const [player, distance] = this.findNearestPlayer({ distance: 300, filter });
		this.target = player;

		if (!this.target) {
			this.idle();

			return;
		}

		if (distance < 5) {
			if (this.movement !== MoveStatus.None) {
				this.stopMove();
			}
			if (!this.healCooldown) {
				this.heal();
			}

			return;
		}

		this.chasePlayer(this.target);
	}

	heal() {
		const animation = this.animations.hug;
		const player = this.target!;

		this.healCooldown = true;
		animation.Play();
		animation.Stopped.Wait();
		player.Humanoid.Health += 10;
		this.healCooldown = false;
	}
}
