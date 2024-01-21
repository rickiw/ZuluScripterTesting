import { ObjectUtils } from "@rbxts/variant/out/ObjectUtils";

export interface AnimationDict<T extends string | number | AnimationTrack | Animation> {
	[key: string]: T;
}

export namespace AnimationUtil {
	export const makeAnimation = (id: number | string): Animation => {
		const Animation = new Instance("Animation");
		Animation.AnimationId = `rbxassetid://${id}`;

		return Animation;
	};

	export const makeAnimationTrack = (animatorOrHumanoid: Animator | Humanoid, anim: Animation): AnimationTrack => {
		if (animatorOrHumanoid.IsA("Animator")) return animatorOrHumanoid.LoadAnimation(anim);
		return animatorOrHumanoid.LoadAnimation(anim);
	};

	export const convertDictionaryToAnimation = (dict: AnimationDict<string | number>): AnimationDict<Animation> => {
		const animDictionary: AnimationDict<Animation> = {};

		for (const key of ObjectUtils.keys(dict)) {
			const entry = dict[key];

			// if its a number..
			if (typeOf(entry) === "number") {
				animDictionary[key] = makeAnimation(entry);
			}

			// if its a string..
			if (typeOf(entry) === "string") {
				const formatted = (entry as string).gsub("rbxassetid://", "")[0];
				animDictionary[key] = makeAnimation(formatted);
			}
		}

		return animDictionary;
	};

	export const convertDictionaryToTracks = (
		dict: AnimationDict<string | number>,
		animatorOrHumanoid: Animator | Humanoid,
	): AnimationDict<AnimationTrack> => {
		const animDictionary: AnimationDict<Animation> = convertDictionaryToAnimation(dict);
		const trackDictionary: AnimationDict<AnimationTrack> = {};

		for (const key of ObjectUtils.keys(animDictionary))
			trackDictionary[key] = makeAnimationTrack(animatorOrHumanoid, animDictionary[key]);

		return trackDictionary;
	};
}
