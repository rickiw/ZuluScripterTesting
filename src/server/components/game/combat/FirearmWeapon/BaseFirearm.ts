import { BaseComponent, Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import FastCast, { Caster, FastCastBehavior } from "@rbxts/fastcast";
import { deepCopy } from "@rbxts/object-utils";
import { Players, RunService, Workspace } from "@rbxts/services";
import { ObjectUtils } from "@rbxts/variant/out/ObjectUtils";
import { store } from "server/store";
import { BULLET_PROVIDER } from "shared/constants/firearm";
import { GlobalEvents } from "shared/network";
import {
	FirearmAnimations,
	FirearmMagazine,
	FirearmProjectile,
	FirearmSounds,
} from "shared/types/combat/FirearmWeapon";
import { FirearmLike } from "shared/types/combat/FirearmWeapon/FirearmLike";
import { FirearmState } from "shared/types/combat/FirearmWeapon/FirearmState";
import { Indexable } from "shared/types/util";
import { deepMerge } from "shared/utils";
import { AnimationUtil } from "shared/utils/animation";
import { getCharacterFromHit, getLimbProjectileDamage, isLimb } from "shared/utils/character";
import { SoundCache, SoundDict, SoundUtil } from "shared/utils/sound";
import { BaseCharacter, PlayerCharacterR15 } from "../../../../../CharacterTypes";

export interface FirearmInstance extends Tool {}
export interface FirearmAttributes {}

// will make AutomaticFirearm, ShotgunFirearm, BoltActionFirearm, etc
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
	char: PlayerCharacterR15 | undefined;

	equipped: boolean;

	loaded: boolean;
	loadedAnimations!: FirearmAnimations<AnimationTrack>;

	caster: Caster;
	behaviour!: FastCastBehavior;

	net = GlobalEvents.createServer({});
	configuration: FirearmLike;

	loadedSounds: FirearmSounds<SoundCache>;

	connections: Indexable<string, RBXScriptConnection> = {};
	state: FirearmState;

	constructor() {
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

		this.char = this.wielder.Character as PlayerCharacterR15;
	}

	getWielder() {
		return this.instance.Parent?.IsA("Model")
			? (Players.GetPlayerFromCharacter(this.instance.Parent) as Player & {
					Character: PlayerCharacterR15;
				})
			: (this.instance.FindFirstAncestorOfClass("Player") as Player & {
					Character: PlayerCharacterR15;
				});
	}

	getRawConfiguration(): FirearmLike {
		return require(this.instance.FindFirstChildOfClass("ModuleScript") as ModuleScript) as FirearmLike;
	}

	getConfiguration(raw: FirearmLike): FirearmLike {
		const fmtConfig: Indexable<string, any> = { ...raw };

		for (const attachment of raw.Attachments)
			fmtConfig[attachment.type] = deepMerge(
				fmtConfig[attachment.type],
				attachment.modifiers as Indexable<string, any>,
			);

		return fmtConfig as FirearmLike;
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

		const configurationModule =
			(this.tool.FindFirstChild("Configuration") as ModuleScript) ||
			(this.tool.FindFirstChildOfClass("ModuleScript") as ModuleScript);

		(configurationModule.Changed as RBXScriptSignal).Connect(() => {
			this.configuration = this.getConfiguration(require(configurationModule) as FirearmLike);
			this.state.configuration = this.configuration;
		});
	}

	loadAnimations() {
		if (!this.char) return;
		this.char.WaitForChild("Humanoid");
		this.loadedAnimations = AnimationUtil.convertDictionaryToTracks(
			this.configuration.animations,
			this.char.Humanoid,
		) as FirearmAnimations<AnimationTrack>;
	}

	load() {
		this.initBehaviour();
		this.initRemotes();
		this.loadAnimations();
		this.loaded = true;
	}

	unload() {
		for (const k of ObjectUtils.keys(this.connections)) this.connections[k].Disconnect();
		this.loaded = false;
	}

	isAbleToFire() {
		return !this.state.magazine.isEmpty() && !this.state.reloading;
	}

	initBehaviour() {
		if (!this.char) return;
		const params = new RaycastParams();
		params.FilterDescendantsInstances = [this.char, this.tool];
		params.FilterType = Enum.RaycastFilterType.Blacklist;

		this.behaviour = FastCast.newBehavior();
		this.behaviour.RaycastParams = params;
		this.behaviour.CosmeticBulletProvider = BULLET_PROVIDER;
		this.behaviour.Acceleration = new Vector3(0, -Workspace.Gravity, 0);

		this.connections.lConn = this.caster.LengthChanged.Connect(
			(cast, lastPoint, dir, displacement, segVel, bullet) => {
				if (bullet && bullet.IsA("BasePart"))
					bullet.CFrame = CFrame.lookAt(lastPoint.add(dir.mul(displacement)), lastPoint);
			},
		);

		this.connections.rayHit = this.caster.RayHit.Connect((cast, result, segmentVelocity) => {
			this.onHit(result, segmentVelocity);
		});

		this.connections.castTerminate = this.caster.CastTerminating.Connect((cast) => {
			BULLET_PROVIDER.ReturnPart(cast.RayInfo.CosmeticBulletObject as BasePart);
		});
	}

	initRemotes() {
		this.connections.fireRemote = this.net.FireFirearm.connect((player, weapon, mousePoint) => {
			if (player === this.wielder && weapon === this.tool) {
				const dir = mousePoint.sub(this.configuration.Barrel.firePoint.WorldPosition).Unit;
				this.fire(dir);
			}
		});

		this.connections.reloadRemote = this.net.ReloadFirearm.connect((player, weapon) => {
			if (player === this.wielder && weapon === this.tool) {
				this.reload();
			}
		});

		const oldState = deepCopy(this.state);
		this.connections.update = RunService.Heartbeat.Connect(() => {
			this.state.configuration = this.configuration;
		});

		this.connections.magUpdate = this.state.magazine.onChanged.Connect(() => {
			store.setWeapon(this.wielder.UserId, this.state);
		});

		this.connections.equipped = this.tool.Equipped.Connect(() => {
			store.setWeapon(this.wielder.UserId, this.state);
			this.equipped = true;
		});
		this.connections.unequipped = this.tool.Unequipped.Connect(() => {
			store.setWeapon(this.wielder.UserId);
			AnimationUtil.stopAll(this.loadedAnimations);
			this.equipped = false;
		});
	}

	getVelocity(): number {
		return this.configuration.Barrel.velocity + this.configuration.Barrel.chambered.velocity;
	}

	fire(direction: Vector3) {
		if (this.state.magazine === undefined) this.loadedSounds.ChamberEmpty.play();
		if (!this.isAbleToFire()) return;
		this.caster.Fire(
			this.configuration.Barrel.firePoint.WorldPosition,
			direction,
			this.getVelocity(),
			this.behaviour,
		);

		this.state.cooldown = true;
		store.setWeapon(this.wielder.UserId, this.state);
		task.delay(60 / this.configuration.Barrel.rpm, () => {
			this.state.cooldown = false;
			store.setWeapon(this.wielder.UserId, this.state);
		});

		this.loadedSounds.Fire.play();
		this.state.magazine?.take();
	}

	reload() {
		if (this.state.reloading || this.state.bullets <= 0) return;

		this.state.reloading = true;
		store.setWeapon(this.wielder.UserId, this.state);
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
		store.setWeapon(this.wielder.UserId, this.state);
	}

	cycleFireModes() {
		// mode is a string
		this.state.mode =
			this.configuration.Barrel.fireModes[
				(this.configuration.Barrel.fireModes.indexOf(this.state.mode) + 1) %
					this.configuration.Barrel.fireModes.size()
			];

		store.setWeapon(this.wielder.UserId, this.state);
	}

	makeProjectile(result: RaycastResult): FirearmProjectile {
		return {
			...this.configuration.Barrel.chambered,
			from: this.configuration.Barrel.firePoint.Position,
			direction: this.configuration.Barrel.firePoint.Position.sub(result.Position).Unit,
		} as FirearmProjectile;
	}

	onHit(result: RaycastResult, velocity: Vector3) {
		if (isLimb(result.Instance)) {
			const Char = getCharacterFromHit(result.Instance) as BaseCharacter;
			const Humanoid = Char.Humanoid;
			const ProjectileData = this.makeProjectile(result);

			Humanoid.TakeDamage(getLimbProjectileDamage(result.Instance, ProjectileData));
		}
	}
}
