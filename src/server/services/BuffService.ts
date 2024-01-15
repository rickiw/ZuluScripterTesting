import { OnStart, Service } from "@flamework/core";
import Maid from "@rbxts/maid";
import { Events } from "server/network";
import { BuffEffect } from "shared/components/variants/buff";

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
export class BuffService implements OnStart {
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
}
