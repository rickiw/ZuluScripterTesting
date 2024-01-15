import { OnStart, Service } from "@flamework/core";
import Maid from "@rbxts/maid";
import { Events } from "server/network";
import { BuffEffect } from "shared/components/variants/buff";
import { PlayerProfile } from "shared/store/saves";
import { PlayerDataLoaded } from "./DataService";

export interface BuffData {
	strength: number;
	duration?: number;
}

/*

	How Buffs Work

  1. Listen for player join, load their purchased perks
  2. Track each players perks and apply the specific buffs to the player  
  3. RewardService? could interface with BuffService to check each multiplier. Same for sprinting

*/

@Service()
export class BuffService implements OnStart, PlayerDataLoaded {
	maid = new Maid();

	onStart() {
		const allBuffs: BuffEffect[] = [];
		const buffEffect = BuffEffect.CreditMultiplier(2);
		allBuffs.push(buffEffect);
		switch (buffEffect.type) {
			case "CreditMultiplier":
				break;
		}
		Events.StaminaBoostChanged.fire([], 2);
	}

	playerDataLoaded(player: Player, data: PlayerProfile) {
		const { purchasedPerks } = data;

		const hasStaminaPerk = purchasedPerks.some((perk) => perk.title === "Ghoul");
		const hasHealthPerk = purchasedPerks.some((perk) => perk.title === "Hex");

		if (hasStaminaPerk) {
			// +20% stamina if has stamina perk :)
			// note: example. need to implement properly when on pc
			Events.StaminaBoostChanged.fire([player], 1.2);
		}
		if (hasHealthPerk) {
			const character = player.Character || player.CharacterAdded.Wait()[0];
			const humanoid = character.FindFirstChildWhichIsA("Humanoid")!;
			humanoid.MaxHealth *= 1.2;
		}
	}
}
