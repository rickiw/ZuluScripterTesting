import { Controller, OnStart } from "@flamework/core";
import { Players, StarterGui, TweenService, UserInputService } from "@rbxts/services";
import { Events } from "client/network";
import { playSound } from "shared/assets/sounds";

function formatSeconds(totalSeconds: number): string {
	const seconds = totalSeconds % 60;
	const minutes = math.floor(totalSeconds / 60);

	const strSeconds = seconds < 10 ? "0" + tostring(seconds) : tostring(seconds);
	const strMinutes = minutes < 10 ? "0" + tostring(minutes) : tostring(minutes);

	return strMinutes + ":" + strSeconds;
}

const player = Players.LocalPlayer;

@Controller()
export class RoombaController implements OnStart {
	staticFx: Sound;
	equipped = false;

	constructor() {
		this.staticFx = playSound("rbxassetid://6648328129", {
			looped: true,
			volume: 0,
		})!;
	}

	screenStatic() {
		const playerGui = player.FindFirstChildOfClass("PlayerGui")!;
		const RFX = playerGui.FindFirstChild("RFX") as ScreenGui;
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
		const RCD = player.FindFirstChild("RoombaCD") as NumberValue;

		const playerGui = player.FindFirstChildOfClass("PlayerGui")!;
		const RFX = playerGui.FindFirstChild("RFX") as ScreenGui;
		const CooldownDisplay = RFX.FindFirstChild("Cooldown") as TextLabel;

		RCD.Changed.Connect((time) => {
			if (CooldownDisplay.Text === "READY" && time !== 0) {
				// fade the cooldown out
				TweenService.Create(CooldownDisplay, new TweenInfo(0.2), {
					TextTransparency: 1,
				}).Play();
				wait(0.5);
				CooldownDisplay.Text = formatSeconds(time);
				// fade the cooldown in
				if (this.equipped) {
					TweenService.Create(CooldownDisplay, new TweenInfo(0.2), {
						TextTransparency: 0,
					}).Play();
				}
			} else if (time !== 0) {
				CooldownDisplay.Text = formatSeconds(time);
			} else if (time === 0) {
				// fade the cooldown out
				TweenService.Create(CooldownDisplay, new TweenInfo(0.2), {
					TextTransparency: 1,
				}).Play();
				wait(0.5);
				CooldownDisplay.Text = "READY";
				// fade the cooldown in
				if (this.equipped) {
					TweenService.Create(CooldownDisplay, new TweenInfo(0.2), {
						TextTransparency: 0,
					}).Play();
				}
			}
		});
	}

	onStart() {
		let roombaActive = false;

		Events.RoombaActive.connect(() => {
			this.screenStatic();
			StarterGui.SetCoreGuiEnabled(Enum.CoreGuiType.Backpack, false);
			roombaActive = true;
		});

		Events.RoombaInactive.connect(() => {
			this.screenStatic();
			StarterGui.SetCoreGuiEnabled(Enum.CoreGuiType.Backpack, true);
			roombaActive = false;
		});

		Events.RoombaLoaded.connect(() => {
			const playerGui = player.FindFirstChildOfClass("PlayerGui")!;
			const RFX = playerGui.FindFirstChild("RFX") as ScreenGui;
			const CooldownDisplay = RFX.FindFirstChild("Cooldown") as TextLabel;

			this.initCooldownWatch();
			this.equipped = true;

			TweenService.Create(CooldownDisplay, new TweenInfo(0.2), {
				TextTransparency: 0,
				BackgroundTransparency: 0.1,
			}).Play();
		});

		Events.RoombaUnloaded.connect(() => {
			const playerGui = player.FindFirstChildOfClass("PlayerGui")!;
			const RFX = playerGui.FindFirstChild("RFX") as ScreenGui;
			const CooldownDisplay = RFX.FindFirstChild("Cooldown") as TextLabel;

			this.equipped = false;

			TweenService.Create(CooldownDisplay, new TweenInfo(0.2), {
				TextTransparency: 1,
				BackgroundTransparency: 1,
			}).Play();
		});

		UserInputService.InputBegan.Connect((input, processed) => {
			if (!processed && input.UserInputType === Enum.UserInputType.MouseButton1 && roombaActive) {
				Events.RoombaExplode.fire();
			}
		});

		UserInputService.TouchTap.Connect((_, processed) => {
			if (!processed && roombaActive) {
				Events.RoombaExplode.fire();
			}
		});
	}
}
