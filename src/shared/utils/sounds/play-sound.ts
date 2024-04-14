import { New } from "@rbxts/fusion";
import { Debris, SoundService } from "@rbxts/services";
import { IS_EDIT } from "shared/constants/core";

export interface SoundOptions {
	volume?: number;
	speed?: number;
	looped?: boolean;
	parent?: Instance;
	lifetime?: number;
}

export function createSound(
	soundId: string,
	{ volume = 0.5, speed = 1, looped = false, parent = SoundService, lifetime = 10 }: SoundOptions = {},
) {
	const sound = New("Sound")({
		SoundId: soundId,
		Volume: volume,
		PlaybackSpeed: speed,
		Looped: looped,
		Parent: parent,
	});

	if (lifetime !== math.huge) {
		Debris.AddItem(sound, lifetime);
	}

	return sound;
}

export function playSound(soundId: string, options?: SoundOptions) {
	if (IS_EDIT) {
		return;
	}

	const sound = createSound(soundId, options);

	sound.Ended.Connect(() => sound.Destroy());
	sound.Play();

	return sound;
}
