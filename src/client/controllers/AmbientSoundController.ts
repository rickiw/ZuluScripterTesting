import { Controller, OnStart } from "@flamework/core";
import { New } from "@rbxts/fusion";
import { setTimeout } from "@rbxts/set-timeout";
import { Players } from "services";
import { sounds } from "shared/utils/sounds";

const MAX_AMBIENT_SOUND_DELAY = 60 * 3;
const MIN_AMBIENT_SOUND_DELAY = 60;

const player = Players.LocalPlayer;

@Controller()
export class SoundController implements OnStart {
	onStart() {
		this.handleAmbientSound();
	}

	ambientSounds = (() => {
		const result: Sound[] = [];
		for (const [_, value] of pairs(sounds.ambient)) {
			const sound = New("Sound")({
				Parent: player,
				SoundId: value,
			});
			result.push(sound);
		}

		return result;
	})();

	handleAmbientSound() {
		const randomTime =
			math.floor(math.random() * (MAX_AMBIENT_SOUND_DELAY - MIN_AMBIENT_SOUND_DELAY + 1)) +
			MIN_AMBIENT_SOUND_DELAY;

		setTimeout(() => {
			const randomSoundChoice = math.floor(math.random() * 3);
			const selectedSound = this.ambientSounds[randomSoundChoice];

			selectedSound.Play();
			this.handleAmbientSound();
		}, randomTime);
	}
}
