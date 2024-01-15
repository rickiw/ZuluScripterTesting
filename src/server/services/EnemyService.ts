import { Service } from "@flamework/core";
import Log from "@rbxts/log";
import Maid from "@rbxts/maid";
import { CharacterRigR15 } from "@rbxts/promise-character";
import { Option } from "@rbxts/rust-classes";
import { HttpService, Workspace } from "@rbxts/services";
import { EntityID, IDService } from "./IDService";
import { CharacterAdded } from "./PlayerService";
import { DamageContributor, DamageSource, HealthChange } from "./variants";

// FOR TESTING ONLY UNTIL GUN SYSTEM IS FINISHED
interface Bullet {
	readonly Damage: number;
}

@Service()
export class EnemyService implements CharacterAdded {
	maid = new Maid();

	constructor(private idService: IDService) {}

	handleDamage(enemy: EntityID, healthChange: HealthChange) {
		const model = this.idService.getModelFromID(enemy);
		if (!model) {
			Log.Warn("Enemy ID {@Enemy} took {@Damage}hp dmg but no model was found", enemy, healthChange.amount);
			return;
		}
		Log.Info("Enemy {@Enemy} took {@DamageSource}", model.Name, HttpService.JSONEncode(healthChange));
	}

	handleDeath(enemy: EntityID, damageSource: DamageSource) {
		const model = this.idService.getModelFromID(enemy);
		if (!model) {
			Log.Warn("Enemy ID {@Enemy} took damage from {@Damage} but no model was found", enemy, damageSource.type);
			return;
		}
		Log.Info("Enemy {@Enemy} died", model.Name);
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

	characterAdded(character: CharacterRigR15) {
		this.maid.GiveTask(
			character.Humanoid.Died.Connect(() => {
				if (character.HumanoidRootPart.Position.Y <= Workspace.FallenPartsDestroyHeight + 10) {
					const entityId = character.GetAttribute("entityId") as EntityID;
					this.handleDeath(entityId, DamageSource.Other());
				}
			}),
		);
	}
}
