import { Service } from "@flamework/core";
import Log from "@rbxts/log";
import { Option } from "@rbxts/rust-classes";
import { HttpService } from "@rbxts/services";
import { DamageContributor, DamageSource, HealthChange } from "./variants";

// FOR TESTING ONLY UNTIL GUN SYSTEM IS FINISHED
interface Bullet {
	readonly Damage: number;
}

@Service()
export class EnemyService {
	constructor() {}

	handleDamage(enemy: Player | BaseHumanoidSCP, healthChange: HealthChange) {
		Log.Info("Enemy {@Enemy} took {@DamageSource}", enemy.Name, HttpService.JSONEncode(healthChange));
	}

	handleDeath(enemy: Player | BaseHumanoidSCP, damageSource?: DamageSource) {
		Log.Info("Enemy {@Enemy} died", enemy.Name);
	}

	bulletHit(shooter: Player, enemy: Player | BaseHumanoidSCP, bullet: Bullet) {
		const crit = enemy.IsA("Player")
			? enemy.Character?.FindFirstChildOfClass("Humanoid")?.Health === 0
			: enemy.Humanoid.Health === 0;
		const shooterModel = shooter.Character!;
		const healthChange: HealthChange = {
			amount: bullet.Damage,
			by: Option.wrap(DamageContributor.Solo(shooterModel)),
			cause: Option.wrap(DamageSource.Projectile()),
			time: tick(),
			crit,
		};
		this.handleDamage(enemy, healthChange);
	}
}
