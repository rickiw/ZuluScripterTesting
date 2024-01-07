import variantModule, { TypeNames, VariantOf } from "@rbxts/variant";

export const SCPKind = variantModule({
	SCP005: (world: defined) => ({ world }),
	SCP034: (world: defined) => ({ world }),
	SCP131: (world: defined) => ({ world }),
	SCP207: (world: defined) => ({ world }),
	SCP939: (world: defined) => ({ world }),
	SCP0179: (world: defined) => ({ world }),
	SCP1182: (world: defined) => ({ world }),
});

export type SCPKind<T extends TypeNames<typeof SCPKind> = undefined> = VariantOf<typeof SCPKind, T>;
