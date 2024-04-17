import { CharacterRigR15 } from "@rbxts/promise-character";
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
		if (animatorOrHumanoid.IsA("Animator")) {
			return animatorOrHumanoid.LoadAnimation(anim);
		}
		return animatorOrHumanoid.LoadAnimation(anim);
	};

	export const stopAll = (dict: AnimationDict<AnimationTrack>): void => {
		for (const key of ObjectUtils.keys(dict)) {
			const track = dict[key];
			track.Stop();
		}
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

		for (const key of ObjectUtils.keys(animDictionary)) {
			trackDictionary[key] = makeAnimationTrack(animatorOrHumanoid, animDictionary[key]);
		}

		return trackDictionary;
	};

	export const rigToChar = (part: BasePart, to: keyof CharacterRigR15, char: CharacterRigR15) => {
		const m6d = new Instance("Motor6D");
		m6d.Parent = char.FindFirstChild(to) as BasePart;
		m6d.Part0 = m6d.Parent as BasePart;
		m6d.Part1 = part;
		m6d.Name = m6d.Part1.Name;
		m6d.Enabled = true;

		return m6d;
	};
}
