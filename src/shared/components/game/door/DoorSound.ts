import { BaseComponent, Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { New } from "@rbxts/fusion";
import { SoundService } from "@rbxts/services";

export interface DoorSoundInstance extends Model {
	Center: BasePart & {
		Close: Sound;
		Found: Sound;
		NotFound: Sound;
		Open: Sound;
	};
}

export interface DoorSoundAttributes {}

@Component({
	defaults: {},
	tag: "doorSound",
})
export class DoorSound<A extends DoorSoundAttributes, I extends DoorSoundInstance>
	extends BaseComponent<A, I>
	implements OnStart
{
	constructor() {
		super();

		if (!SoundService.FindFirstChild("Effects")) {
			New("SoundGroup")({
				Name: "Effects",
				Parent: SoundService,
			});
		}
	}

	doorOpen() {
		this.instance.Center.Open.SoundGroup = SoundService.FindFirstChild("Effects") as SoundGroup;
		this.instance.Center.Open.Play();
	}

	doorClose() {
		this.instance.Center.Close.SoundGroup = SoundService.FindFirstChild("Effects") as SoundGroup;
		this.instance.Center.Close.Play();
	}

	doorAccept() {
		this.instance.Center.Found.SoundGroup = SoundService.FindFirstChild("Effects") as SoundGroup;
		this.instance.Center.Found.Play();
	}

	doorDeny() {
		this.instance.Center.NotFound.SoundGroup = SoundService.FindFirstChild("Effects") as SoundGroup;
		this.instance.Center.NotFound.Play();
	}

	onStart() {}
}
