import variantModule, { TypeNames, VariantOf } from "@rbxts/variant";

export interface BuffData {
	strength: number;
	duration?: number;
}

export const BuffEffect = variantModule({
	HealthIncrease: (health: number) => ({ health }),
	StaminaMultiplier: (multiplier: number) => ({ multiplier }),
	HealthMultiplier: (multiplier: number) => ({ multiplier }),
	CreditMultiplier: (multiplier: number) => ({ multiplier }),
});

export type BuffEffect<T extends TypeNames<typeof BuffEffect> = undefined> = VariantOf<typeof BuffEffect, T>;
