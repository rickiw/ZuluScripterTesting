import variantModule, { TypeNames, VariantOf } from "@rbxts/variant";

export const enum BuffKind {
	Regeneration = 1,
	Potion = 2,
	Invulnerability = 3,
	Poisoned = -1,
}

export function isBuff(buff: BuffKind) {
	return buff > 0;
}

export const BuffCategory = variantModule({
	Natural: {},
	Physical: {},
});

export type BuffCategory<T extends TypeNames<typeof BuffCategory> = undefined> = VariantOf<typeof BuffCategory, T>;

export interface BuffData {
	strength: number;
	duration?: number;
}

export const BuffEffect = variantModule({
	MovementSpeed: (speed: number) => ({ speed }),
});

export type BuffEffect<T extends TypeNames<typeof BuffEffect> = undefined> = VariantOf<typeof BuffEffect, T>;

export const BuffSource = variantModule({
	Character: (by: number) => ({ by }),
	World: {},
	Command: {},
	Item: {},
	Buff: {},
	Unknown: {},
});

export type BuffSource<T extends TypeNames<typeof BuffSource> = undefined> = VariantOf<typeof BuffSource, T>;
