import { BaseComponent, Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import Maid from "@rbxts/maid";
import { CharacterRigR15 } from "@rbxts/promise-character";
import { Players } from "@rbxts/services";
import { ROOMBA_ANIMATIONS } from "shared/constants/roomba";
import { AnimationDict, AnimationUtil } from "shared/utils/animation";

export interface TouchpadInstance extends Tool {}
export interface TouchpadAttributes {}

@Component({ tag: "baseTouchpad" })
export class BaseTouchpad<A extends TouchpadAttributes, I extends TouchpadInstance>
	extends BaseComponent<A, I>
	implements OnStart
{
	maid = new Maid();
	wielder!: Player & {
		Character: CharacterRigR15 | RoombaCharacter;
	};

	loadedAnimations!: AnimationDict<AnimationTrack>;

	constructor() {
		super();

		this.wielder = this.getWielder();
	}

	onStart(): void {
		this.loadedAnimations = AnimationUtil.convertDictionaryToTracks(
			ROOMBA_ANIMATIONS,
			this.wielder.Character.Humanoid,
		);

		let m6d: Motor6D | undefined;

		this.instance.Equipped.Connect(() => {
			m6d = AnimationUtil.rigToChar(
				this.instance.FindFirstChild("Handle") as BasePart,
				"RightHand",
				this.wielder.Character as CharacterRigR15,
			);

			this.loadedAnimations.equip.Play();
			this.loadedAnimations.idle.Play();
		});

		this.instance.Unequipped.Connect(() => {
			AnimationUtil.stopAll(this.loadedAnimations);
			m6d?.Destroy();
		});
	}

	getWielder() {
		return this.instance.Parent?.IsA("Model")
			? (Players.GetPlayerFromCharacter(this.instance.Parent) as Player & {
					Character: CharacterRigR15;
				})
			: (this.instance.FindFirstAncestorOfClass("Player") as Player & {
					Character: CharacterRigR15;
				});
	}
}
