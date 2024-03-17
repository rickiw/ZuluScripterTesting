import { ObjectUtils } from "@rbxts/variant/out/ObjectUtils";
import { createSound, SoundOptions } from "shared/assets/sounds";

export interface SoundDict<T extends string | number | Sound | SoundCache> {
	[index: string]: T;
}

export class SoundCache {
	cache: Sound[] = [];
	playing: Sound[] = [];

	constructor(
		public id: string | number,
		public props?: SoundOptions,
	) {}

	addSound() {
		this.cache.push(SoundUtil.makeSound(this.id, this.props));
	}

	play() {
		if (!this.cache.isEmpty()) {
			const idx = this.playing.size() - 1;
			this.playing[idx] = this.cache.pop() as Sound;
			this.playing[idx].Play();
			this.playing[idx].Ended.Connect(() => {
				this.cache.push(this.playing[idx]);
				this.playing.remove(idx);
			});
		} else {
			this.addSound();
			this.play();
		}
	}

	stop() {
		for (const sound of this.playing) {
			sound.Stop();
		}
	}
}

export namespace SoundUtil {
	export const makeSound = (id: string | number, props?: SoundOptions): Sound => {
		return createSound(`rbxassetid://${id}`, props);
	};

	export const convertDictToSoundDict = (dict: SoundDict<number | string>): SoundDict<Sound> => {
		const soundDict: SoundDict<Sound> = {};
		for (const key of ObjectUtils.keys(dict)) {
			soundDict[key] = makeSound(dict[key], {});
		}
		return soundDict;
	};

	export const convertDictToSoundCacheDict = (
		dict: SoundDict<number | string>,
		props?: SoundOptions,
	): SoundDict<SoundCache> => {
		const soundDict: SoundDict<SoundCache> = {};
		for (const key of ObjectUtils.keys(dict)) {
			soundDict[key] = new SoundCache(dict[key], props);
		}
		return soundDict;
	};
}
