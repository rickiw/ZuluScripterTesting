import { Controller, OnStart } from "@flamework/core";
import Log, { Logger } from "@rbxts/log";
import { Players, StarterGui, TweenService, UserInputService, Workspace } from "@rbxts/services";
import { playSound } from "shared/assets/sounds/play-sound";
import { GlobalEvents } from "shared/network";
import { PlayerCharacterR15, RoombaCharacter } from "../../CharacterTypes";

function formatSeconds(totalSeconds: number): string {
	const seconds = totalSeconds % 60;
	const minutes = math.floor(totalSeconds / 60);

	const strSeconds = seconds < 10 ? "0" + tostring(seconds) : tostring(seconds);
	const strMinutes = minutes < 10 ? "0" + tostring(minutes) : tostring(minutes);

	return strMinutes + ":" + strSeconds;
}

@Controller()
export class RoombaController implements OnStart {
	net = GlobalEvents.createClient({});
	staticFx: Sound;
	equipped = false;

	roombaActive = false;
	roomba?: RoombaCharacter;

	constructor() {
		this.staticFx = playSound("rbxassetid://6648328129", {
			looped: true,
			volume: 0,
		}) as Sound;

		Log.SetLogger(Logger.configure().WriteTo(Log.RobloxOutput()).Create());
	}

	screenStatic() {
		const PlayerGui = Players.LocalPlayer.FindFirstChildOfClass("PlayerGui") as PlayerGui;
		const RFX = PlayerGui.FindFirstChild("RFX") as ScreenGui;
		const Static = RFX.FindFirstChild("Static") as ImageLabel;

		Static.ImageTransparency = 0;
		Static.Size = UDim2.fromScale(5, 5);
		this.staticFx.Volume = 1;

		const jumbleThread = task.spawn(() => {
			while (wait()[0]) {
				Static.Rotation = math.random(0, 2) * 90;
			}
		});

		task.delay(1, () => {
			TweenService.Create(Static, new TweenInfo(0.2), { ImageTransparency: 1 }).Play();
			TweenService.Create(this.staticFx, new TweenInfo(0.2), { Volume: 0 }).Play();
			wait(3);
			coroutine.close(jumbleThread);
		});
	}

	initCooldownWatch() {
		const Player = Players.LocalPlayer;
		const RCD = Player.FindFirstChild("RoombaCD") as NumberValue;
		const RCU = Player.FindFirstChild("RoombaCanUse") as BoolValue;

		const PlayerGui = Players.LocalPlayer.FindFirstChildOfClass("PlayerGui") as PlayerGui;
		const RFX = PlayerGui.FindFirstChild("RFX") as ScreenGui;
		const CooldownDisp = RFX.FindFirstChild("Cooldown") as TextLabel;

		RCD.Changed.Connect((time) => {
			if (CooldownDisp.Text === "READY" && time !== 0) {
				// fade the cooldown out
				TweenService.Create(CooldownDisp, new TweenInfo(0.2), {
					TextTransparency: 1,
				}).Play();
				wait(0.5);
				CooldownDisp.Text = formatSeconds(time);
				// fade the cooldown in
				if (this.equipped) {
					TweenService.Create(CooldownDisp, new TweenInfo(0.2), {
						TextTransparency: 0,
					}).Play();
				}
			} else if (time !== 0) {
				CooldownDisp.Text = formatSeconds(time);
			} else if (time === 0) {
				// fade the cooldown out
				TweenService.Create(CooldownDisp, new TweenInfo(0.2), {
					TextTransparency: 1,
				}).Play();
				wait(0.5);
				CooldownDisp.Text = "READY";
				// fade the cooldown in
				if (this.equipped) {
					TweenService.Create(CooldownDisp, new TweenInfo(0.2), {
						TextTransparency: 0,
					}).Play();
				}
			}
		});

		RCU.Changed.Connect((canUse) => {
			// fade the cooldown out
			TweenService.Create(CooldownDisp, new TweenInfo(0.2), {
				TextTransparency: 1,
			}).Play();
			wait(0.5);
			CooldownDisp.Text = "IN USE";
			// fade the cooldown in
			if (this.equipped) {
				TweenService.Create(CooldownDisp, new TweenInfo(0.2), {
					TextTransparency: 0,
				}).Play();
			}
		});
	}

	getHumanoid() {
		return (
			(Players.LocalPlayer.Character as PlayerCharacterR15) ||
			(Players.LocalPlayer.CharacterAdded.Wait() as unknown as PlayerCharacterR15)
		).WaitForChild("Humanoid") as Humanoid;
	}

	startController() {
		(this.getHumanoid().Changed as RBXScriptSignal).Connect(() => {
			const Dir = this.getHumanoid().MoveDirection;
			if (this.roomba && this.roombaActive && this.roomba.Humanoid) {
				this.roomba.Humanoid.Move(Dir);
				this.roomba.Humanoid.Jump = this.getHumanoid().Jump;
			}
		});
	}

	onStart() {
		const Player = Players.LocalPlayer;
		const OGChr =
			(Player.Character as PlayerCharacterR15) || (Player.CharacterAdded.Wait()[0] as PlayerCharacterR15);
		const Camera = Workspace.CurrentCamera as Camera;
		this.startController();

		this.net.RoombaActive.connect((chr) => {
			this.screenStatic();
			StarterGui.SetCoreGuiEnabled(Enum.CoreGuiType.Backpack, false);

			Camera.CameraSubject = chr.Humanoid;
			OGChr.Humanoid.WalkSpeed = 0;
			OGChr.Humanoid.JumpHeight = 0;
			this.roomba = chr as RoombaCharacter;
			this.roombaActive = true;
		});

		this.net.RoombaInactive.connect((chr) => {
			this.screenStatic();
			StarterGui.SetCoreGuiEnabled(Enum.CoreGuiType.Backpack, true);

			Camera.CameraSubject = chr.Humanoid;
			OGChr.Humanoid.WalkSpeed = 16;
			OGChr.Humanoid.JumpHeight = 7.3;
			this.roomba = undefined;
			this.roombaActive = false;
		});

		this.net.RoombaLoaded.connect(() => {
			const PlayerGui = Players.LocalPlayer.FindFirstChildOfClass("PlayerGui") as PlayerGui;
			const RFX = PlayerGui.FindFirstChild("RFX") as ScreenGui;
			const CooldownDisp = RFX.FindFirstChild("Cooldown") as TextLabel;

			this.initCooldownWatch();
			this.equipped = true;

			// fade the cooldown in
			TweenService.Create(CooldownDisp, new TweenInfo(0.2), {
				TextTransparency: 0,
				BackgroundTransparency: 0.1,
			}).Play();
		});

		this.net.RoombaUnloaded.connect(() => {
			const PlayerGui = Players.LocalPlayer.FindFirstChildOfClass("PlayerGui") as PlayerGui;
			const RFX = PlayerGui.FindFirstChild("RFX") as ScreenGui;
			const CooldownDisp = RFX.FindFirstChild("Cooldown") as TextLabel;

			this.equipped = false;

			// fade the cooldown in
			TweenService.Create(CooldownDisp, new TweenInfo(0.2), {
				TextTransparency: 1,
				BackgroundTransparency: 1,
			}).Play();
		});

		UserInputService.InputBegan.Connect((io, gpe) => {
			if (!gpe && io.UserInputType === Enum.UserInputType.MouseButton1 && this.roombaActive) {
				this.net.RoombaExplode();
			}
		});

		UserInputService.TouchTap.Connect((_, gpe) => {
			if (!gpe && this.roombaActive) {
				this.net.RoombaExplode();
			}
		});
	}
}
