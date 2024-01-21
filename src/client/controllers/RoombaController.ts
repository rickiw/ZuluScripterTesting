import { Controller, OnStart } from "@flamework/core";
import Log, { Logger } from "@rbxts/log";
import { Players, StarterGui, TweenService, UserInputService, Workspace } from "@rbxts/services";
import { playSound } from "shared/assets/sounds/play-sound";
import { GlobalEvents } from "shared/network";

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

	constructor() {
		this.staticFx = playSound("rbxassetid://6648328129", {
			looped: true,
			volume: 0,
		}) as Sound;
	}

	screenStatic() {
		const PlayerGui = Players.LocalPlayer.FindFirstChildOfClass("PlayerGui") as PlayerGui;
		const RFX = PlayerGui.FindFirstChild("RFX") as ScreenGui;
		const Static = RFX.FindFirstChild("Static") as ImageLabel;

		Static.ImageTransparency = 0;
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
	}

	onStart() {
		const Player = Players.LocalPlayer;
		const Camera = Workspace.CurrentCamera as Camera;
		Log.SetLogger(Logger.configure().WriteTo(Log.RobloxOutput()).Create());

		let RoombaActive = false;

		this.net.RoombaActive.connect((old) => {
			this.screenStatic();
			StarterGui.SetCoreGuiEnabled(Enum.CoreGuiType.Backpack, false);

			RoombaActive = true;
		});

		this.net.RoombaInactive.connect(() => {
			this.screenStatic();
			StarterGui.SetCoreGuiEnabled(Enum.CoreGuiType.Backpack, true);
			RoombaActive = false;
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
			if (!gpe && io.UserInputType === Enum.UserInputType.MouseButton1 && RoombaActive) {
				this.net.RoombaExplode();
			}
		});

		UserInputService.TouchTap.Connect((_, gpe) => {
			if (!gpe && RoombaActive) {
				this.net.RoombaExplode();
			}
		});
	}
}
