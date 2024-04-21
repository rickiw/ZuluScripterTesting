import { BaseComponent, Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import FastCast, { Caster, FastCastBehavior } from "@rbxts/fastcast";
import { New } from "@rbxts/fusion";
import Log from "@rbxts/log";
import Object from "@rbxts/object-utils";
import { CharacterRigR15 } from "@rbxts/promise-character";
import { Option } from "@rbxts/rust-classes";
import { Players, ReplicatedStorage, RunService, Workspace } from "@rbxts/services";
import { Events, Functions } from "server/network";
import { EnemyService } from "server/services/EnemyService";
import { FirearmService } from "server/services/FirearmService";
import { EntityID } from "server/services/IDService";
import { DamageContributor, DamageSource, HealthChange } from "server/services/variants";
import { serverStore } from "server/store";
import { selectPlayerSave } from "server/store/saves";
import { BULLET_PROVIDER } from "shared/constants/firearm";
import {
	FirearmAnimations,
	FirearmLike,
	FirearmMagazine,
	FirearmProjectile,
	FirearmSoundManager,
	FirearmSounds,
	IModification,
	IModificationSave,
} from "shared/constants/weapons";
import { FirearmState } from "shared/constants/weapons/state";
import { AnimationUtil, Indexable, getCharacterFromHit, getLimbProjectileDamage, isLimb } from "shared/utils";

export interface FirearmInstance extends Tool {
	Muzzle: BasePart & {
		MuzzleFlash: ParticleEmitter;
		MuzzleLight: PointLight;
		Smoke: ParticleEmitter;
	};
}

export interface FirearmAttributes {}

@Component({
	tag: "baseFirearm",
	refreshAttributes: false,
})
export class BaseFirearm<A extends FirearmAttributes, I extends FirearmInstance>
	extends BaseComponent<A, I>
	implements OnStart
{
	tool: Tool;
	wielder: Player;
	character: CharacterRigR15 | undefined;

	equipped: boolean;

	loaded: boolean;
	loadedAnimations!: FirearmAnimations<AnimationTrack>;

	caster: Caster;
	behavior!: FastCastBehavior;

	configuration: FirearmLike;
	attachments: IModification[] = [];

	soundManager: FirearmSoundManager<FirearmSounds>;

	connections: Indexable<string, RBXScriptConnection> = {};
	state: FirearmState;

	constructor(
		private firearmService: FirearmService,
		private enemyService: EnemyService,
	) {
		super();
		this.configuration = this.getRawConfiguration();
		this.wielder = this.getWielder();
		this.tool = this.instance;
		this.equipped = false;

		this.caster = new FastCast();
		this.loaded = false;

		this.soundManager = new FirearmSoundManager(this.configuration.sounds, this.instance);

		this.state = {
			configuration: this.configuration,
			magazine: new FirearmMagazine(this.configuration.Magazine),
			cooldown: false,
			reloading: false,
			reserve: 90,
			mode: this.configuration.Barrel.fireModes[0],
		};

		this.state.magazine.onChanged.Connect(() => {
			serverStore.setWeapon(this.wielder.UserId, this.state);
		});

		Events.UnequipFirearm.connect((player, weapon) => {
			if (weapon === this.tool) {
				const state = serverStore.getState();
				const data = selectPlayerSave(player.UserId)(state);
				if (!data) {
					Log.Warn(
						"Player {@Player} doesn't have save data | FirearmService->PlayerDataRemoving",
						player.Name,
					);
					return;
				}
				const weaponData = data.weaponData;

				for (const key of Object.keys(weaponData)) {
					if (key === this.tool.Name) {
						const newWeaponData = this.firearmService.getUpdatedWeaponData(weaponData, key, {
							ammo: this.state.reserve,
							magazine: this.state.magazine.holding,
							equipped: true,
						});

						serverStore.updatePlayerSave(player.UserId, { weaponData: newWeaponData });
					}
				}

				this.instance.Destroy();
			}
		});

		this.character = this.wielder.Character as CharacterRigR15;

		Events.Help.connect((player) => {
			if (player === this.wielder) {
				Log.Warn("Giving extra 30 bullets to {@Player}", this.wielder.Name);
				this.updateState({ reserve: this.state.reserve + 30 });
			}
		});
	}

	onStart() {
		this.load();

		this.instance.AncestryChanged.Connect((instance, parent) => {
			if (parent && (parent.IsA("Model") || parent.IsA("Backpack"))) {
				const player = parent.IsA("Model") ? Players.GetPlayerFromCharacter(parent) : parent.Parent;
				if (player && player.IsA("Player")) {
					if (player === this.wielder) {
						return;
					} else {
						this.unload();
						this.load();
					}
				}
			}
		});
	}

	private getRawConfiguration() {
		return require(this.instance.FindFirstChildOfClass("ModuleScript")!) as FirearmLike;
	}

	private getWielder() {
		return this.instance.Parent?.IsA("Model")
			? (Players.GetPlayerFromCharacter(this.instance.Parent) as Player & {
					Character: CharacterRigR15;
				})
			: (this.instance.FindFirstAncestorOfClass("Player") as Player & {
					Character: CharacterRigR15;
				});
	}

	loadAnimations() {
		while (!this.character || !this.character.IsDescendantOf(Workspace)) {
			wait();
		}
		this.character.WaitForChild("Humanoid");
		this.loadedAnimations = AnimationUtil.convertDictionaryToTracks(
			this.configuration.animations,
			this.character.Humanoid,
		) as FirearmAnimations<AnimationTrack>;
	}

	load() {
		this.initBehavior();
		this.initRemotes();
		this.loadAnimations();
		this.loaded = true;
	}

	unload() {
		for (const key of Object.keys(this.connections)) {
			this.connections[key].Disconnect();
		}
		this.loaded = false;
	}

	initBehavior() {
		if (!this.character) {
			return;
		}
		const params = new RaycastParams();
		params.FilterDescendantsInstances = [this.character, this.tool];
		params.FilterType = Enum.RaycastFilterType.Exclude;

		this.behavior = FastCast.newBehavior();
		this.behavior.RaycastParams = params;
		this.behavior.CosmeticBulletProvider = BULLET_PROVIDER;
		this.behavior.Acceleration = new Vector3(0, -Workspace.Gravity, 0);

		this.connections.lConn = this.caster.LengthChanged.Connect(
			(caster, lastPoint, dir, displacement, segmentVelocity, bullet) => {
				if (bullet && bullet.IsA("BasePart")) {
					bullet.CFrame = CFrame.lookAt(lastPoint.add(dir.mul(displacement)), lastPoint);
				}
			},
		);

		this.connections.rayHit = this.caster.RayHit.Connect((caster, result, segmentVelocity) => {
			Log.Verbose("Hit something");
			this.onHit(result, segmentVelocity);
		});

		this.connections.castTerminate = this.caster.CastTerminating.Connect((cast) => {
			BULLET_PROVIDER.ReturnPart(cast.RayInfo.CosmeticBulletObject as BasePart);
		});
	}

	initRemotes() {
		Functions.FireFirearm.setCallback((player, weapon, mousePosition) => {
			if (player !== this.wielder || weapon !== this.tool || !this.canFire()) {
				return false;
			}
			const direction = mousePosition.sub(this.configuration.Barrel.firePoint.WorldPosition).Unit;
			this.fire(direction);
			return true;
		});

		this.connections.reloadRemote = Events.ReloadFirearm.connect((player, weapon) => {
			if (player === this.wielder && weapon === this.tool) {
				this.reload();
			}
		});

		this.connections.update = RunService.Heartbeat.Connect(() => {
			this.state.configuration = this.configuration;
		});

		this.connections.magUpdate = this.state.magazine.onChanged.Connect(() => {
			serverStore.setWeapon(this.wielder.UserId, this.state);
		});

		this.connections.equipped = this.tool.Equipped.Connect(() => {
			this.equip();
		});

		this.connections.unequipped = this.tool.Unequipped.Connect(() => {
			this.unequip();
		});
	}

	equip() {
		serverStore.setWeapon(this.wielder.UserId, this.state);
		this.equipped = true;
		Events.SetWeaponInfo.fire(this.wielder, this.tool.Name, this.state.magazine.holding, this.state.reserve, true);
	}

	unequip() {
		this.updateState({ reloading: false });
		serverStore.setWeapon(this.wielder.UserId, undefined);
		AnimationUtil.stopAll(this.loadedAnimations);
		this.soundManager.play("AimOut");
		this.equipped = false;
	}

	getVelocity() {
		return this.configuration.Barrel.velocity + this.configuration.Barrel.chambered.velocity;
	}

	updateState(update: Partial<FirearmState>) {
		this.state = { ...this.state, ...update };
		serverStore.setWeapon(this.wielder.UserId, this.state);
		Events.SetWeaponInfo.fire(this.wielder, this.tool.Name, this.state.magazine.holding, this.state.reserve);
	}

	updateMagazineHolding(holding: number) {
		this.state.magazine.holding = holding;
		serverStore.setWeapon(this.wielder.UserId, this.state);
	}

	updateToolAttachmentsByName(weapon: Tool, modifications: IModificationSave[]) {
		const newModifications: IModification[] = [];
		modifications.forEach((modification) => {
			const mod = ReplicatedStorage.Assets.Attachments.FindFirstChild(modification.modification) as
				| Modification
				| undefined;
			if (!mod) {
				Log.Warn(
					"Modification {@Modification} not found | BaseFirearm->UpdateToolAttachmentsByName",
					modification,
				);
				return;
			}
			newModifications.push({
				modification: mod,
				name: modification.name,
				type: modification.type,
			});
		});
		this.updateToolAttachments(weapon, newModifications);
	}

	updateToolAttachments(weapon: Tool, modifications: IModification[]) {
		this.attachments.forEach((attachment) => {
			attachment.modification.Destroy();
		});
		this.attachments.clear();
		modifications.forEach((modification) => {
			const weaponMount = weapon.FindFirstChild(modification.type) as WeaponModificationMount | undefined;
			if (!weaponMount) {
				Log.Warn(
					"No mount found on {@Weapon} for {@Modification} | BaseFirearm->UpdateToolAttachments",
					weapon.Name,
					modification.type,
				);
				return;
			}

			const modificationClone = modification.modification.Clone();
			const attachmentOffsetPosition = modificationClone.Attachment.CFrame.Inverse();
			const modAttachment = weaponMount.ModAttachment;
			modificationClone.Parent = weaponMount;
			modificationClone.PivotTo(modAttachment.WorldCFrame.mul(attachmentOffsetPosition));
			New("WeldConstraint")({
				Parent: modificationClone,
				Part0: weaponMount,
				Part1: modificationClone,
			});

			const newModification: IModification = {
				modification: modificationClone,
				name: modification.name,
				type: modification.type,
			};
			this.attachments.push(newModification);
		});
	}

	fire(direction: Vector3) {
		if (this.state.magazine === undefined || (this.state.magazine.holding <= 0 && this.state.reserve <= 0)) {
			this.soundManager.play("ChamberEmpty");
		}
		if (!this.canFire()) {
			return;
		}

		this.caster.Fire(
			this.configuration.Barrel.firePoint.WorldPosition,
			direction,
			this.getVelocity(),
			this.behavior,
		);

		task.spawn(() => {
			this.instance.Muzzle.MuzzleFlash.Emit(10);
			this.instance.Muzzle.Smoke.Emit(1);
			this.instance.Muzzle.MuzzleLight.Enabled = true;
			wait();
			this.instance.Muzzle.MuzzleLight.Enabled = false;
		});

		this.state.cooldown = true;
		serverStore.setWeapon(this.wielder.UserId, this.state);
		task.delay(60 / this.configuration.Barrel.rpm, () => {
			this.updateState({ cooldown: false });
		});

		this.soundManager.play("Fire", { volume: 0.6 });
		this.loadedAnimations.Fire.Play();
		this.state.magazine.take();
		Events.SetWeaponInfo.fire(this.wielder, this.tool.Name, this.state.magazine.holding, this.state.reserve);
	}

	reload() {
		if (this.state.reloading) {
			return;
		}
		if (this.state.reserve <= 0) {
			this.soundManager.play("ChamberEmpty");
			return;
		}

		this.updateState({ reloading: true });
		this.soundManager.play("Reload");
		this.loadedAnimations.Reload.Play();

		const bulletsNeededToFillMag = this.state.magazine.getCapacity() - this.state.magazine.getRemaining();
		const bulletsToFill = math.min(bulletsNeededToFillMag, this.state.reserve);

		this.loadedAnimations.Reload.Stopped.Wait();

		if (!this.state.reloading) {
			return;
		}

		this.updateState({ reserve: this.state.reserve - bulletsToFill, reloading: false });
		this.updateMagazineHolding(this.state.magazine.holding + bulletsToFill);
		Events.SetWeaponInfo.fire(this.wielder, this.tool.Name, this.state.magazine.holding, this.state.reserve);
	}

	cycleFireModes() {
		// mode is a string
		this.state.mode =
			this.configuration.Barrel.fireModes[
				(this.configuration.Barrel.fireModes.indexOf(this.state.mode) + 1) %
					this.configuration.Barrel.fireModes.size()
			];

		serverStore.setWeapon(this.wielder.UserId, this.state);
	}

	makeProjectile(result: RaycastResult) {
		return {
			...this.configuration.Barrel.chambered,
			from: this.configuration.Barrel.firePoint.Position,
			direction: this.configuration.Barrel.firePoint.Position.sub(result.Position).Unit,
		} as FirearmProjectile;
	}

	onHit(result: RaycastResult, velocity: Vector3) {
		if (isLimb(result.Instance)) {
			const character = getCharacterFromHit(result.Instance)!;
			const humanoid = character.Humanoid;
			const projectileData = this.makeProjectile(result);
			const healthBefore = humanoid.Health;
			const damage = getLimbProjectileDamage(result.Instance, projectileData);

			const invincible = character.GetAttribute("invincible") as boolean;
			if (invincible) {
				return;
			}
			const characterEntityId = character.GetAttribute("entityId") as EntityID;
			humanoid.TakeDamage(damage);
			if (healthBefore > 0) {
				Events.PlayHitmarker.fire(this.wielder);
			}
			if (characterEntityId === undefined) {
				Log.Warn(
					"Character {@Character} does not have an entityId attribute | BaseFirearm->OnHit",
					character.Name,
				);
				return;
			}

			const shooter = this.wielder.Character!;
			const crit = humanoid.Health <= 0;
			const healthChange: HealthChange = {
				amount: damage,
				by: Option.wrap(DamageContributor.Solo(shooter)),
				cause: Option.wrap(DamageSource.Projectile()),
				time: tick(),
				crit,
			};
			if (crit && healthBefore > 0) {
				Events.EnemyKilled.fire(this.wielder);
			}
			this.enemyService.handleDamage(characterEntityId, healthChange);
		}
	}

	canFire() {
		return !this.state.magazine.isEmpty() && !this.state.reloading;
	}
}
