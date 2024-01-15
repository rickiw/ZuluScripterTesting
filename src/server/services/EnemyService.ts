import { Service } from "@flamework/core";
import Log from "@rbxts/log";
import { Option } from "@rbxts/rust-classes";
import { HttpService } from "@rbxts/services";
import { EntityID, IDService } from "./IDService";
import { DamageContributor, DamageSource, HealthChange } from "./variants";

// FOR TESTING ONLY UNTIL GUN SYSTEM IS FINISHED
interface Bullet {
	readonly Damage: number;
}

@Service()
export class EnemyService {
	constructor(private idService: IDService) {}

	handleDamage(enemy: EntityID, healthChange: HealthChange) {
		const model = this.idService.getModelFromID(enemy);
		if (!model) {
			Log.Warn(
				"Enemy ID {@Enemy} took {@DamageSource} but no model was found",
				enemy,
				HttpService.JSONEncode(healthChange),
			);
			return;
		}
		Log.Info("Enemy {@Enemy} took {@DamageSource}", model.Name, HttpService.JSONEncode(healthChange));
	}

	handleDeath(enemy: EntityID, damageSource?: DamageSource) {
		const model = this.idService.getModelFromID(enemy);
		if (!model) {
			Log.Warn(
				"Enemy ID {@Enemy} took {@DamageSource} but no model was found",
				enemy,
				HttpService.JSONEncode(damageSource),
			);
			return;
		}
		Log.Info("Enemy {@Enemy} died", model.Name);
	}

	bulletHit(shooter: EntityID, enemy: EntityID, bullet: Bullet) {
		const shooterModel = this.idService.getModelFromID(shooter);
		if (!shooterModel) {
			Log.Warn("Enemy ID {@Enemy} took a bullet hit but no model was found", enemy);
			return;
		}
		const enemyModel = this.idService.getModelFromID(enemy);
		if (!enemyModel) {
			Log.Warn("Enemy ID {@Enemy} took a bullet hit but no model was found", enemy);
			return;
		}
		const crit = enemyModel.Humanoid.Health <= 0;

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
