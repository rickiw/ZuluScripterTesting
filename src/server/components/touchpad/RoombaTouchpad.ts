import { Component } from "@flamework/components";
import { CharacterRigR15 } from "@rbxts/promise-character";
import { ReplicatedStorage, RunService, TweenService, Workspace } from "@rbxts/services";
import { Events } from "server/network";
import { ROOMBA_COOLDOWN, ROOMBA_JUMPPOWER, ROOMBA_WALKSPEED } from "shared/constants/roomba";
import { playSound } from "shared/utils/sounds/play-sound";
import { BaseTouchpad, TouchpadAttributes, TouchpadInstance } from "./BaseTouchpad";

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
	oldChr: CharacterRigR15 | RoombaCharacter | undefined;

	hummingSfx: Sound;
	__cd: NumberValue;
	__canUse: BoolValue;

	constructor() {
		super();

		this.hummingSfx = playSound("rbxassetid://6748208799", {
			looped: true,
			volume: 0,
		}) as Sound;

		this.__cd =
			(this.wielder.FindFirstChild("RoombaCD") as NumberValue) || new Instance("NumberValue", this.wielder);
		this.__cd.Name = "RoombaCD";

		this.__canUse =
			(this.wielder.FindFirstChild("RoombaCanUse") as BoolValue) || new Instance("BoolValue", this.wielder);
		this.__canUse.Name = "RoombaCanUse";
	}

	enableCd() {
		if (this.getCd()) {
			return;
		}
		// delay disableCd, so that it toggles back to false after COOLDOWN_TIME
		task.spawn(() => {
			let Left = ROOMBA_COOLDOWN;
			while (Left > 0) {
				Left--;
				this.__cd.Value = Left;
				wait(1);
			}
		});
	}

	getCd() {
		return this.__cd.Value !== 0;
	}

	onStart() {
		super.onStart();
		this.instance.Activated.Connect(() => {
			if (this.getCd()) {
				return;
			}
			if (!this.roombaCharacter) {
				return this.spawnRoomba();
			}

			if (!this.roombaActive && this.roombaCharacter) {
				this.roombaActive = true;
				this.transferCharacters();
				return;
			}
		});

		// will be used for more advanced stuff l8r, for now just alert the player when its
		// equipped and unequipped
		this.instance.Equipped.Connect(() => Events.RoombaLoaded(this.wielder));
		this.instance.Unequipped.Connect(() => Events.RoombaUnloaded(this.wielder));

		Events.RoombaExplode.connect((player) => {
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
		if (this.roombaCharacter !== undefined || !this.wielder || !this.wielder.Character || this.getCd()) {
			return;
		}
		const RoombaClone = ReplicatedStorage.FindFirstChild("Assets")
			?.FindFirstChild("Roomba")
			?.Clone() as RoombaCharacter;
		if (RoombaClone && this.wielder.Character) {
			RoombaClone.Parent = Workspace;
			this.roombaCharacter = RoombaClone;
			this.roombaCharacter.Humanoid.WalkSpeed = ROOMBA_WALKSPEED;
			this.roombaCharacter.Humanoid.JumpPower = ROOMBA_JUMPPOWER;
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
		this.enableCd();

		this.roombaActive = false;
		this.transferCharacters();
		playSound("rbxassetid://7818577205", { parent: this.roombaCharacter, volume: 2, lifetime: 3 });

		wait(0.5);
		triggerExplosion((this.roombaCharacter as RoombaCharacter).HumanoidRootPart.Position, 15, 100);
		this.hummingSfx.Parent = undefined;
		(this.roombaCharacter as RoombaCharacter).Destroy();
		this.roombaCharacter = undefined;
	}

	transferCharacters() {
		if (this.roombaActive) {
			this.roombaCharacter?.HumanoidRootPart.SetNetworkOwner(this.wielder);
			Events.RoombaActive(this.wielder, this.roombaCharacter as BaseCharacter);
		} else {
			task.delay(1, () => Events.RoombaInactive(this.wielder, this.wielder.Character));
		}
	}
}
