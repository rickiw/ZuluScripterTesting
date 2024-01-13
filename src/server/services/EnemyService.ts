import { Service } from "@flamework/core";
import Log from "@rbxts/log";
import { HttpService } from "@rbxts/services";
import { DamageSource, HealthChange } from "./variants";

@Service()
export class EnemyService {
	constructor() {}

	handleDamage(enemy: BaseSCP, healthChange: HealthChange) {
		Log.Info("Enemy {@Enemy} took {@DamageSource}", enemy.Name, HttpService.JSONEncode(healthChange));
	}

	handleDeath(enemy: BaseSCP, damageSource?: DamageSource) {
		Log.Info("Enemy {@Enemy} died", enemy.Name);
	}
}
