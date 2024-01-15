import { Modding, Service } from "@flamework/core";
import Log from "@rbxts/log";
import Maid from "@rbxts/maid";
import { CharacterRigR15 } from "@rbxts/promise-character";
import { Option } from "@rbxts/rust-classes";
import { HttpService } from "@rbxts/services";
import { EntityID, IDService } from "./IDService";
import { DamageContributor, DamageSource, HealthChange } from "./variants";

// FOR TESTING ONLY UNTIL GUN SYSTEM IS FINISHED
interface Bullet {
	readonly Damage: number;
}

export interface SCPKilled {
	scpKilled(scp: BaseHumanoidSCP, deathCause: HealthChange): void;
}

export interface CharacterKilled {
	characterKilled(character: CharacterRigR15, deathCause: HealthChange): void;
}

@Service()
export class EnemyService {
	maid = new Maid();
	private characterKilledListeners = new Set<CharacterKilled>();
	private scpKilledListeners = new Set<SCPKilled>();

	constructor(private idService: IDService) {
		Modding.onListenerAdded<CharacterKilled>((object) => this.characterKilledListeners.add(object));
		Modding.onListenerRemoved<CharacterKilled>((object) => this.characterKilledListeners.delete(object));
		Modding.onListenerAdded<SCPKilled>((object) => this.scpKilledListeners.add(object));
		Modding.onListenerRemoved<SCPKilled>((object) => this.scpKilledListeners.delete(object));
	}

	handleDamage(enemy: EntityID, healthChange: HealthChange) {
		const model = this.idService.getModelFromID(enemy);
		if (!model) {
			Log.Warn("Enemy ID {@Enemy} took {@Damage}hp dmg but no model was found", enemy, healthChange.amount);
			return;
		}
		if (healthChange.crit) this.handleDeath(enemy, healthChange);
		Log.Info("Enemy {@Enemy} took {@DamageSource}", model.Name, HttpService.JSONEncode(healthChange));
	}

	handleDeath(enemy: EntityID, healthChange: HealthChange) {
		const model = this.idService.getModelFromID(enemy);
		if (!model) {
			Log.Warn(
				"Enemy ID {@Enemy} took damage from {@Damage} but no model was found",
				enemy,
				healthChange.by.unwrap().uid.Name,
			);
			return;
		}

		Log.Info("Enemy {@Enemy} died", model.Name);

		const isPlayer = this.idService.isPlayer(enemy);
		if (isPlayer) {
			this.characterKilledListeners.forEach((listener) =>
				listener.characterKilled(model as CharacterRigR15, healthChange),
			);
		} else {
			this.scpKilledListeners.forEach((listener) => listener.scpKilled(model as BaseHumanoidSCP, healthChange));
		}
	}

	// Simulate bullet hit until gun system is finished
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
