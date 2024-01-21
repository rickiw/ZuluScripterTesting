import { BaseComponent, Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import FastCast, { Caster, FastCastBehavior } from "@rbxts/fastcast";
import { Players, Workspace } from "@rbxts/services";
import { ObjectUtils } from "@rbxts/variant/out/ObjectUtils";
import { store } from "server/store";
import { BULLET_PROVIDER } from "shared/constants/firearm";
import { GlobalEvents } from "shared/network";
import { FirearmMagazine, FirearmProjectile, FirearmSounds } from "shared/types/combat/FirearmWeapon";
import { FirearmLike } from "shared/types/combat/FirearmWeapon/FirearmLike";
import { FirearmState } from "shared/types/combat/FirearmWeapon/FirearmState";
import { Indexable } from "shared/types/util";
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

	loaded: boolean;

	caster: Caster;
	behaviour!: FastCastBehavior;

	net = GlobalEvents.createServer({});
	configuration: FirearmLike;

	loadedSounds: FirearmSounds<SoundCache>;

	connections: Indexable<string, RBXScriptConnection> = {};
	state: FirearmState;

	constructor() {
		super();
		this.configuration = this.getConfiguration();
		this.wielder = this.getWielder();
		this.tool = this.instance;

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
		};

		this.state.magazine?.onChanged.Connect(() => {
			store.setWeapon(this.wielder.UserId, this.state);
		});

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

	getConfiguration(): FirearmLike {
		return require(this.instance.FindFirstChildOfClass("ModuleScript") as ModuleScript) as FirearmLike;
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

		this.connections.equipped = this.instance.Equipped.Connect(() => {
			store.setWeapon(this.wielder.UserId, this.state);
		});
	}

	load() {
		this.initBehaviour();
		this.initRemotes();
		this.loaded = true;
	}

	unload() {
		print("unloading");
		for (const k of ObjectUtils.keys(this.connections)) this.connections[k].Disconnect();
		this.loaded = false;
	}

	isAbleToFire() {
		return !this.state.magazine.isEmpty();
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
			print("HI");
			this.onHit(result, segmentVelocity);
		});

		this.connections.castTerminate = this.caster.CastTerminating.Connect((cast) => {
			BULLET_PROVIDER.ReturnPart(cast.RayInfo.CosmeticBulletObject as BasePart);
		});
	}

	initRemotes() {
		this.connections.fireRemote = this.net.FireFirearm.connect((player, weapon, mousePoint) => {
			print(player, weapon, mousePoint);
			if (player === this.wielder && weapon === this.tool) {
				print("firing");

				const dir = mousePoint.sub(this.configuration.Barrel.firePoint.WorldPosition).Unit;
				this.fire(dir);
			}
		});

		this.connections.equipped = this.tool.Equipped.Connect(() => store.setWeapon(this.wielder.UserId, this.state));
		this.connections.unequipped = this.tool.Unequipped.Connect(() => store.setWeapon(this.wielder.UserId));
	}

	getVelocity(): number {
		return this.configuration.Barrel.velocity + this.configuration.Barrel.chambered.velocity;
	}

	fire(direction: Vector3) {
		if (this.state.magazine === undefined) this.loadedSounds.ChamberEmpty.play();
		if (!this.isAbleToFire()) return;
		print(this.state.magazine?.getRemaining());
		this.caster.Fire(
			this.configuration.Barrel.firePoint.WorldPosition,
			direction,
			this.getVelocity(),
			this.behaviour,
		);

		this.loadedSounds.Fire.play();
		this.state.magazine?.take();
	}

	makeProjectile(result: RaycastResult): FirearmProjectile {
		return {
			...this.configuration.Barrel.chambered,
			from: this.configuration.Barrel.firePoint.Position,
			direction: this.configuration.Barrel.firePoint.Position.sub(result.Position).Unit,
		} as FirearmProjectile;
	}

	onHit(result: RaycastResult, velocity: Vector3) {
		print(result);
		if (isLimb(result.Instance)) {
			const Char = getCharacterFromHit(result.Instance) as BaseCharacter;
			const Humanoid = Char.Humanoid;
			const ProjectileData = this.makeProjectile(result);

			Humanoid.TakeDamage(getLimbProjectileDamage(result.Instance, ProjectileData));
		}
	}
}
