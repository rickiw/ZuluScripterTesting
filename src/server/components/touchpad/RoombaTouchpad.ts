import { Component } from "@flamework/components";
import Log, { Logger } from "@rbxts/log";
import { ReplicatedStorage, RunService, TweenService, Workspace } from "@rbxts/services";
import { playSound } from "shared/assets/sounds/play-sound";
import { GlobalEvents } from "shared/network";
import { PlayerCharacterR15, RoombaCharacter } from "../../../Types";
import { BaseTouchpad, TouchpadAttributes, TouchpadInstance } from "./BaseTouchpad";

const ROOMBA_CONF = {
	Speed: 10,
	JumpPower: 24,
};

const COOLDOWN_TIME = 4 * 60;

function castRayDown(fromCFrame: CFrame, distance: number, blacklist: Instance[]): RaycastResult | undefined {
	// Create the Ray
	const direction = fromCFrame.UpVector.mul(-1).mul(distance);

	// Set up the Raycast parameters
	const parameters = new RaycastParams();
	parameters.FilterDescendantsInstances = blacklist;
	parameters.FilterType = Enum.RaycastFilterType.Exclude;

	// Perform the raycast
	return Workspace.Raycast(fromCFrame.Position, direction, parameters);
}

const triggerExplosion = (position: Vector3, radius: number, maxDamage: number) => {
	const explosion = new Instance("Explosion");
	explosion.BlastPressure = 25;
	explosion.DestroyJointRadiusPercent = 0;
	explosion.BlastRadius = radius;
	explosion.Position = position;

	const modelsHit: { [key: string]: boolean } = {};

	explosion.Hit.Connect((part, distance) => {
		const parentModel = part.Parent;
		if (parentModel) {
			if (modelsHit[parentModel.Name]) {
				return;
			}
			modelsHit[parentModel.Name] = true;
			const humanoid = parentModel.FindFirstChild("Humanoid") as Humanoid;
			if (humanoid) {
				let distanceFactor = distance / explosion.BlastRadius;
				distanceFactor = 1 - distanceFactor;
				humanoid.TakeDamage(maxDamage * distanceFactor * 2);
			}
		}
	});

	explosion.Parent = Workspace;

	playSound("rbxassetid://3802269741", {
		parent: explosion,
		volume: 1,
	});
};

@Component({ tag: "roombaPad" })
export class RoombaTouchpad extends BaseTouchpad<TouchpadAttributes, TouchpadInstance> {
	roombaCharacter: RoombaCharacter | undefined;
	roombaActive = false;
	net = GlobalEvents.createServer({});
	oldChr: PlayerCharacterR15 | RoombaCharacter | undefined;

	hummingSfx: Sound;
	__cd: BoolValue;

	constructor() {
		super();
		Log.SetLogger(Logger.configure().WriteTo(Log.RobloxOutput()).Create());

		this.hummingSfx = playSound("rbxassetid://6748208799", {
			looped: true,
			volume: 0,
		}) as Sound;

		this.__cd = (this.wielder.FindFirstChild("RoombaCD") as BoolValue) || new Instance("BoolValue", this.wielder);
		this.__cd.Name = "RoombaCD";
	}

	enableCd() {
		this.__cd.Value = true;
		this.net.RoombaCooldown(this.wielder, COOLDOWN_TIME);
		// delay disableCd, so that it toggles back to false after COOLDOWN_TIME
		task.delay(COOLDOWN_TIME, () => (this.__cd.Value = false));
	}

	getCd() {
		return this.__cd.Value;
	}

	onStart() {
		this.instance.Activated.Connect(() => {
			if (this.getCd()) return;
			if (!this.roombaCharacter) return this.spawnRoomba();

			if (!this.roombaActive && this.roombaCharacter) {
				this.roombaActive = true;
				this.transferCharacters();
				return;
			}
		});

		// will be used for more advanced stuff l8r, for now just alert the player when its
		// equipped and unequipped
		this.instance.Equipped.Connect(() => this.net.RoombaLoaded(this.wielder));
		this.instance.Unequipped.Connect(() => this.net.RoombaUnloaded(this.wielder));

		this.net.RoombaExplode.connect((player) => {
			if (player === this.wielder) {
				task.spawn(() => {
					this.explode();
				});
			}
		});

		RunService.Heartbeat.Connect(() => {
			if (this.roombaCharacter) {
				this.hummingSfx.Parent = this.roombaCharacter;
				const Vel = this.roombaCharacter.HumanoidRootPart.AssemblyLinearVelocity.Magnitude;
				const maxSpeed = 20;
				const targetVolume = math.clamp(Vel / maxSpeed, 0, 1.7) * 1.7;

				const info = new TweenInfo(0.1); // 0.5 is just an example duration, adjust as needed.

				// Create a new tween.
				const tween = TweenService.Create(this.hummingSfx, info, { Volume: targetVolume });

				// Play the tween.
				tween.Play();
			}
		});
	}

	spawnRoomba() {
		if (this.roombaCharacter !== undefined || !this.wielder || !this.wielder.Character || this.getCd()) return;
		const RoombaClone = ReplicatedStorage.FindFirstChild("Assets")
			?.FindFirstChild("Roomba")
			?.Clone() as RoombaCharacter;
		if (RoombaClone && this.wielder.Character) {
			RoombaClone.Parent = Workspace;
			this.roombaCharacter = RoombaClone;
			this.roombaCharacter.Humanoid.WalkSpeed = ROOMBA_CONF.Speed;
			this.roombaCharacter.Humanoid.JumpPower = ROOMBA_CONF.JumpPower;
			this.roombaCharacter.Humanoid.Health = 35;
			this.roombaCharacter.Humanoid.MaxHealth = 35;

			RoombaClone.HumanoidRootPart.CFrame = this.wielder.Character.HumanoidRootPart.CFrame.mul(
				new CFrame(0, 0, -2),
			);

			RoombaClone.HumanoidRootPart.ApplyImpulse(
				this.wielder.Character.HumanoidRootPart.CFrame.LookVector.mul(20),
			);

			RoombaClone.Humanoid.Running.Connect(() => {
				const below = castRayDown(RoombaClone.HumanoidRootPart.CFrame, 3, [RoombaClone]);
				if (below) {
					RoombaClone.HumanoidRootPart.Dust.Enabled = RoombaClone.Humanoid.MoveDirection !== Vector3.zero;
					RoombaClone.HumanoidRootPart.Dust.Color = new ColorSequence(below.Instance.Color);
				} else {
					RoombaClone.HumanoidRootPart.Dust.Enabled = false;
				}
			});

			RoombaClone.Humanoid.Died.Connect(() => this.explode());
		}
	}

	explode() {
		if (!this.roombaCharacter) return;
		this.enableCd();

		this.roombaActive = false;
		if (this.wielder.Character.Name === "Roomba") this.transferCharacters();
		playSound("rbxassetid://7818577205", { parent: this.roombaCharacter, volume: 2 });

		wait(0.5);
		triggerExplosion(this.roombaCharacter.HumanoidRootPart.Position, 15, 100);
		this.hummingSfx.Parent = undefined;
		this.roombaCharacter.Destroy();
		this.roombaCharacter = undefined;
	}

	transferCharacters() {
		if (!this.wielder.Character && this.oldChr) this.wielder.Character = this.oldChr;
		else if (!this.wielder.Character && !this.oldChr)
			this.wielder.Character = Workspace.FindFirstChild(this.wielder.Name) as PlayerCharacterR15;
		if (!this.roombaCharacter) return;
		// set chr to roomba
		if (this.roombaActive) {
			const OldChr = this.wielder.Character;
			OldChr.Humanoid.UnequipTools();
			this.wielder.Character = this.roombaCharacter;
			OldChr.Parent = Workspace;
			this.oldChr = OldChr;
		}

		// set chr to plrchr
		if (!this.roombaActive && this.oldChr) {
			const OldChr = this.wielder.Character;
			this.wielder.Character = this.oldChr;
			OldChr.Parent = Workspace;
			this.oldChr = OldChr;
		}

		if (this.roombaActive) this.net.RoombaActive(this.wielder, this.oldChr as PlayerCharacterR15);
		else task.delay(1, () => this.net.RoombaInactive(this.wielder));
	}
}
