import { BaseComponent, Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import FastCast, { Caster, FastCastBehavior } from "@rbxts/fastcast";
import { New } from "@rbxts/fusion";
import Log from "@rbxts/log";
import Object from "@rbxts/object-utils";
import { CharacterRigR15 } from "@rbxts/promise-character";
import { Option } from "@rbxts/rust-classes";
import { Players, ReplicatedStorage, RunService, Workspace } from "@rbxts/services";
import { Events } from "server/network";
import { EnemyService } from "server/services/EnemyService";
import { FirearmService } from "server/services/FirearmService";
import { EntityID } from "server/services/IDService";
import { DamageContributor, DamageSource, HealthChange } from "server/services/variants";
import { serverStore } from "server/store";
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
import {
	AnimationUtil,
	CachedValue,
	Indexable,
	getCharacterFromHit,
	getLimbProjectileDamage,
	isLimb,
} from "shared/utils";

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
	wielder = new CachedValue<(Player & { Character: CharacterRigR15 }) | undefined>();
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
		this.equipped = this.wielder !== undefined;

		this.caster = new FastCast();
		this.loaded = false;

		this.soundManager = new FirearmSoundManager(this.configuration.sounds, this.instance);

		this.state = {
			configuration: this.configuration,
			magazine: new FirearmMagazine(this.configuration.magazine),
			cooldown: false,
			reloading: false,
			reserve: this.configuration.magazine.capacity,
			mode: this.configuration.barrel.fireModes[0],
		};

		this.state.magazine.onChanged.Connect(() => {
			const wielder = this.wielder.get();
			if (!wielder) {
				Log.Warn("No wielder | BaseFirearm->MagazineChanged");
				return;
			}
			this.setWeaponState(wielder, this.state);
		});

		Events.Help.connect((player) => {
			const wielder = this.wielder.get();
			if (player === wielder) {
				Log.Warn("Giving extra 30 bullets to {@Player}", wielder.Name);
				this.updateState({ reserve: this.state.reserve + 30 });
			}
		});
	}

	onStart() {
		this.instance.Destroying.Connect(() => {
			this.unload(this.wielder.get() ?? this.wielder.oldValue!);
		});

		this.instance.AncestryChanged.Connect((instance, parent) => {
			if (!parent || !parent.IsDescendantOf(game)) {
				this.wielder.set(undefined);
				return;
			}
			if (parent.IsA("Model") || parent.IsA("Backpack")) {
				const player = parent.IsA("Model") ? Players.GetPlayerFromCharacter(parent) : parent.Parent;

				if (player && player.IsA("Player")) {
					if (player === this.wielder.get()) {
						return;
					} else {
						this.wielder.set(player as never);
						this.unload(player);
						this.load(player);
					}
				}
			}
		});
	}

	private getRawConfiguration() {
		return require(this.instance.FindFirstChildOfClass("ModuleScript")!) as FirearmLike;
	}

	loadAnimations() {
		const wielder = this.wielder.get();
		if (!wielder) {
			Log.Warn("No wielder | BaseFirearm->LoadAnimations");
			return;
		}

		wielder.Character.WaitForChild("Humanoid", 5);
		this.loadedAnimations = AnimationUtil.convertDictionaryToTracks(
			this.configuration.animations,
			wielder.Character.Humanoid.Animator,
		) as FirearmAnimations<AnimationTrack>;
	}

	load(player: Player) {
		Log.Info(
			"ServerSide weapon loaded {@Weapon} for {@Player} | BaseFirearm->Load",
			this.instance.Name,
			player.Name,
		);
		serverStore.setWeapon(player.UserId, this.state);

		this.initBehavior();
		this.initRemotes();
		this.loadAnimations();

		this.loaded = true;
	}

	unload(player: Player) {
		for (const key of Object.keys(this.connections)) {
			this.connections[key].Disconnect();
		}

		Events.UnloadWeapon.fire(player);
		this.firearmService.unloadWeapon(this.instance);
		this.loaded = false;
	}

	initBehavior() {
		const wielder = this.wielder.get();
		if (!wielder) {
			Log.Warn("No wielder | BaseFirearm->initBehavior");
			return;
		}

		if (!wielder.Character) {
			return;
		}
		const params = new RaycastParams();
		params.FilterDescendantsInstances = [wielder.Character, this.instance];
		params.FilterType = Enum.RaycastFilterType.Exclude;

		this.behavior = FastCast.newBehavior();
		this.behavior.RaycastParams = params;
		this.behavior.Acceleration = new Vector3(0, -Workspace.Gravity, 0);

		this.connections.lConn = this.caster.LengthChanged.Connect(
			(caster, lastPoint, dir, displacement, segmentVelocity, bullet) => {
				if (bullet && bullet.IsA("BasePart")) {
					bullet.CFrame = CFrame.lookAt(lastPoint.add(dir.mul(displacement)), lastPoint);
				}
			},
		);

		this.connections.rayHit = this.caster.RayHit.Connect((caster, result, segmentVelocity) => {
			this.onHit(result, segmentVelocity);
		});
	}

	initRemotes() {
		this.connections.update = RunService.Heartbeat.Connect(() => {
			this.state.configuration = this.configuration;
		});

		this.connections.magUpdate = this.state.magazine.onChanged.Connect(() => {
			const wielder = this.wielder.get();
			if (!wielder) {
				Log.Warn("No wielder | BaseFirearm->MagazineChanged");
				return;
			}
			this.setWeaponState(wielder, this.state);
		});

		this.connections.equipped = this.instance.Equipped.Connect(() => {
			this.equip();
		});

		this.connections.unequipped = this.instance.Unequipped.Connect(() => {
			this.unequip();
		});
	}

	setWeaponState(player: Player, state: FirearmState | undefined) {
		if (!state) {
			Log.Warn("No state to set | BaseFirearm->SetWeaponState");
		}
		serverStore.updateWeapon(player.UserId, state as never);
	}

	equip() {
		const wielder = this.wielder.get();
		if (!wielder) {
			Log.Warn("No wielder | BaseFirearm->Equip");
			return;
		}
		Events.ToggleWeaponEquip.fire(wielder, true);
		this.updateClientState(wielder, true);
		this.setWeaponState(wielder, this.state);
		this.equipped = true;
	}

	unequip() {
		const wielder = this.wielder.get();
		if (!wielder) {
			Log.Warn("No wielder | BaseFirearm->Unequip");
			return;
		}
		this.updateState({ reloading: false });
		AnimationUtil.stopAll(this.loadedAnimations);
		Events.ToggleWeaponEquip.fire(wielder, false);
		this.soundManager.play("AimOut");
		this.equipped = false;
	}

	getVelocity() {
		return this.configuration.barrel.velocity + this.configuration.barrel.chambered.velocity;
	}

	updateState(update: Partial<FirearmState>) {
		const wielder = this.wielder.get();
		if (!wielder) {
			Log.Warn("No wielder | BaseFirearm->UpdateState");
			return;
		}
		this.state = { ...this.state, ...update };
		this.setWeaponState(wielder, this.state);
		this.updateClientState(wielder);
	}

	updateMagazineHolding(holding: number) {
		const wielder = this.wielder.get();
		if (!wielder) {
			Log.Warn("No wielder | BaseFirearm->UpdateMagazineHolding");
			return;
		}
		this.state.magazine.holding = holding;
		this.setWeaponState(wielder, this.state);
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
		if (this.state.magazine === undefined || this.state.magazine.holding <= 0) {
			this.soundManager.play("ChamberEmpty");
		}

		if (!this.canFire()) {
			Log.Warn("Cannot fire weapon last check | BaseFirearm->Fire");
			return;
		}

		this.caster.Fire(
			this.configuration.barrel.firePoint.WorldPosition,
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

		const wielder = this.wielder.get();
		if (!wielder) {
			Log.Warn("No wielder | BaseFirearm->Fire");
			return;
		}

		this.updateState({ cooldown: true });
		this.setWeaponState(wielder, this.state);
		task.delay(60 / this.configuration.barrel.rpm, () => {
			this.updateState({ cooldown: false });
		});

		this.soundManager.play("Fire", { volume: 0.6 });
		this.loadedAnimations.Fire.Play();
		this.state.magazine.take();
		this.updateClientState(wielder);
	}

	updateClientState(player: Player, override?: boolean) {
		Events.SetWeaponInfo.fire(
			player,
			this.instance.Name,
			this.state.magazine.holding,
			this.state.reserve,
			override ?? false,
		);
	}

	reload() {
		if (this.state.reloading) {
			Log.Warn("Already reloading | BaseFirearm->Reload");
			return;
		}
		if (this.state.reserve <= 0) {
			Log.Warn("No bullets in reserve | BaseFirearm->Reload");
			this.soundManager.play("ChamberEmpty");
			return;
		}
		const wielder = this.wielder.get();
		if (!wielder) {
			Log.Warn("No wielder | BaseFirearm->Reload");
			return;
		}

		this.updateState({ reloading: true });
		this.soundManager.play("Reload");
		this.loadedAnimations.Reload.Play();

		const bulletsNeededToFillMag = this.state.magazine.getCapacity() - this.state.magazine.getRemaining();
		const bulletsToFill = math.min(bulletsNeededToFillMag, this.state.reserve);

		this.loadedAnimations.Reload.Stopped.Wait();

		if (!this.state.reloading) {
			Log.Warn("Reload cancelled | BaseFirearm->Reload");
			return;
		}

		this.updateState({ reserve: this.state.reserve - bulletsToFill, reloading: false });
		this.updateMagazineHolding(this.state.magazine.holding + bulletsToFill);
		this.updateClientState(wielder);
	}

	cycleFireModes() {
		this.state.mode =
			this.configuration.barrel.fireModes[
				(this.configuration.barrel.fireModes.indexOf(this.state.mode) + 1) %
					this.configuration.barrel.fireModes.size()
			];

		const wielder = this.wielder.get();
		if (!wielder) {
			Log.Warn("No wielder | BaseFirearm->CycleFireModes");
			return;
		}
		Log.Info("Cycled fire mode | BaseFirearm->CycleFireModes");
		this.setWeaponState(wielder, this.state);
	}

	makeProjectile(result: RaycastResult) {
		return {
			...this.configuration.barrel.chambered,
			from: this.configuration.barrel.firePoint.Position,
			direction: this.configuration.barrel.firePoint.Position.sub(result.Position).Unit,
		} as FirearmProjectile;
	}

	onHit(result: RaycastResult, velocity: Vector3) {
		if (isLimb(result.Instance)) {
			const character = getCharacterFromHit(result.Instance)!;
			const humanoid = character.Humanoid;
			const projectileData = this.makeProjectile(result);
			const healthBefore = humanoid.Health;
			const damage = getLimbProjectileDamage(result.Instance, projectileData);
			const wielder = this.wielder.get();
			if (!wielder) {
				Log.Warn("No wielder | BaseFirearm->OnHit");
				return;
			}

			const invincible = character.GetAttribute("invincible") as boolean;
			if (invincible) {
				return;
			}
			const characterEntityId = character.GetAttribute("entityId") as EntityID;
			humanoid.TakeDamage(damage);
			if (healthBefore > 0) {
				Events.PlayHitmarker.fire(wielder);
			}
			if (characterEntityId === undefined) {
				Log.Warn(
					"Character {@Character} does not have an entityId attribute | BaseFirearm->OnHit",
					character.Name,
				);
				return;
			}

			const shooter = wielder.Character!;
			const crit = humanoid.Health <= 0;
			const healthChange: HealthChange = {
				amount: damage,
				by: Option.wrap(DamageContributor.Solo(shooter)),
				cause: Option.wrap(DamageSource.Projectile()),
				time: tick(),
				crit,
			};
			if (crit && healthBefore > 0) {
				Events.EnemyKilled.fire(wielder);
			}
			this.enemyService.handleDamage(characterEntityId, healthChange);
		}
	}

	canFire() {
		return !this.state.magazine.isEmpty() && !this.state.reloading;
	}
}
