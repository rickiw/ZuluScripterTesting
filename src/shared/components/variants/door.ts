import variantModule, { TypeNames, VariantOf } from "@rbxts/variant";

export const DoorKind = variantModule({
	Chunky: {},
	HeavyBlast: {},
	DoubleBlast: {},
	DoubleGlass: {},
	DoubleSwingBlast: {},
	DoubleSwing: {},
	SlidingGlass: {},
	SingleGlass: {},
	SingleBlast: {},
	SingleSwing: {},
	Sliding: {},
});

export type DoorKind<T extends TypeNames<typeof DoorKind> = undefined> = VariantOf<typeof DoorKind, T>;
