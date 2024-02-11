import { BaseComponent, Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import FastCast, { Caster, FastCastBehavior } from "@rbxts/fastcast";
import Log from "@rbxts/log";
import Object from "@rbxts/object-utils";
import { CharacterRigR15 } from "@rbxts/promise-character";
import { Option } from "@rbxts/rust-classes";
import { Players, RunService, Workspace } from "@rbxts/services";
import { Events } from "server/network";
import { EnemyService } from "server/services/EnemyService";
import { EntityID } from "server/services/IDService";
import { DamageContributor, DamageSource, HealthChange } from "server/services/variants";
import { serverStore } from "server/store";
import { BULLET_PROVIDER } from "shared/constants/firearm";
import {
	FirearmAnimations,
	FirearmLike,
	FirearmMagazine,
	FirearmProjectile,
	FirearmSounds,
} from "shared/constants/weapons";
import { FirearmState } from "shared/constants/weapons/state";
import {
	AnimationUtil,
	Indexable,
	SoundCache,
	SoundDict,
	SoundUtil,
	deepMerge,
	getCharacterFromHit,
	getLimbProjectileDamage,
	isLimb,
} from "shared/utils";

export interface FirearmInstance extends Tool {}

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

	loadedSounds: FirearmSounds<SoundCache>;

	connections: Indexable<string, RBXScriptConnection> = {};
	state: FirearmState;

	constructor(private enemyService: EnemyService) {
		super();
		this.configuration = this.getConfiguration(this.getRawConfiguration());
		this.wielder = this.getWielder();
		this.tool = this.instance;
		this.equipped = false;

		this.caster = new FastCast();
		this.loaded = false;

		this.loadedSounds = SoundUtil.convertDictToSoundCacheDict(
			this.configuration.sounds as SoundDict<number | string>,
			{ parent: this.tool, volume: 1 },
		) as FirearmSounds<SoundCache>;

		this.state = {
			configuration: this.configuration,
			magazine: new FirearmMagazine(this.configuration.Magazine),
			cooldown: false,
			reloading: false,
			bullets: 500,
			mode: this.configuration.Barrel.fireModes[0],
		};

		this.state.magazine.onChanged.Connect(() => {
			serverStore.setWeapon(this.wielder.UserId, this.state);
		});

		this.character = this.wielder.Character as CharacterRigR15;
	}

	onStart() {
		this.load();

		this.instance.AncestryChanged.Connect((instance, parent) => {
			if (parent && (parent.IsA("Model") || parent.IsA("Backpack"))) {
				const player = parent.IsA("Model") ? Players.GetPlayerFromCharacter(parent) : parent.Parent;
				if (player && player.IsA("Player")) {
					if (player === this.wielder) return;
					else {
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

	private getConfiguration(raw: FirearmLike) {
		const fmtConfig: Indexable<string, any> = { ...raw };

		for (const attachment of raw.Attachments) {
			fmtConfig[attachment.type] = deepMerge(
				fmtConfig[attachment.type],
				attachment.modifiers as Indexable<string, any>,
			);
		}

		return fmtConfig as FirearmLike;
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
		if (!this.character) return;
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
		for (const key of Object.keys(this.connections)) this.connections[key].Disconnect();
		this.loaded = false;
	}

	initBehavior() {
		if (!this.character) return;
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
		this.connections.fireRemote = Events.FireFirearm.connect((player, weapon, mousePoint) => {
			if (player === this.wielder && weapon === this.tool) {
				Log.Verbose("Firing firearm");
				const direction = mousePoint.sub(this.configuration.Barrel.firePoint.WorldPosition).Unit;
				this.fire(direction);
			}
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
			serverStore.setWeapon(this.wielder.UserId, this.state);
			this.equipped = true;
		});

		this.connections.unequipped = this.tool.Unequipped.Connect(() => {
			serverStore.setWeapon(this.wielder.UserId);
			AnimationUtil.stopAll(this.loadedAnimations);
			this.equipped = false;
		});
	}

	getVelocity() {
		return this.configuration.Barrel.velocity + this.configuration.Barrel.chambered.velocity;
	}

	fire(direction: Vector3) {
		if (this.state.magazine === undefined) this.loadedSounds.ChamberEmpty.play();
		if (!this.canFire()) return;

		this.caster.Fire(
			this.configuration.Barrel.firePoint.WorldPosition,
			direction,
			this.getVelocity(),
			this.behavior,
		);

		this.state.cooldown = true;
		serverStore.setWeapon(this.wielder.UserId, this.state);
		task.delay(60 / this.configuration.Barrel.rpm, () => {
			this.state.cooldown = false;
			serverStore.setWeapon(this.wielder.UserId, this.state);
		});

		this.loadedSounds.Fire.play();
		this.state.magazine.take();
	}

	reload() {
		if (this.state.reloading || this.state.bullets <= 0) return;
		this.state.reloading = true;
		serverStore.setWeapon(this.wielder.UserId, this.state);
		this.loadedSounds.Reload.play();
		this.loadedAnimations.Reload.Play();

		// Calculate bullets needed for a full mag
		const bulletsNeeded = this.state.magazine.getCapacity() - this.state.magazine.getRemaining();
		// Store how many bullets we will actually move from reserve to mag (either the bulletsNeeded, or the total bullets we have if they are less than bulletsNeeded)
		const bulletsToMove = math.min(bulletsNeeded, this.state.bullets);

		// Subtract needed bullets from bullet state and add it to the magBullets state
		this.state.bullets -= bulletsToMove;
		this.state.magazine.holding += bulletsToMove;

		this.loadedAnimations.Reload.Stopped.Wait();
		this.state.reloading = false;
		serverStore.setWeapon(this.wielder.UserId, this.state);
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
			const damage = getLimbProjectileDamage(result.Instance, projectileData);

			const invincible = character.GetAttribute("invincible") as boolean;
			if (invincible) return;
			const characterEntityId = character.GetAttribute("entityId") as EntityID;
			humanoid.TakeDamage(damage);
			assert(characterEntityId, "Character entity ID not found");

			const shooter = this.wielder.Character!;
			const crit = humanoid.Health <= 0;
			const healthChange: HealthChange = {
				amount: damage,
				by: Option.wrap(DamageContributor.Solo(shooter)),
				cause: Option.wrap(DamageSource.Projectile()),
				time: tick(),
				crit,
			};

			this.enemyService.handleDamage(characterEntityId, healthChange);
		}
	}

	canFire() {
		return !this.state.magazine.isEmpty() && !this.state.reloading;
	}
}
