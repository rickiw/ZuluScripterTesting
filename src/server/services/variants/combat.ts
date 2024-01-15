import variantModule, { TypeNames, VariantOf } from "@rbxts/variant";

export const DamageContributor = variantModule({
	Solo: (uid: BaseSCP) => ({ uid }),
});

export type DamageContributor<T extends TypeNames<typeof DamageContributor> = undefined> = VariantOf<
	typeof DamageContributor,
	T
>;

export const DamageSource = variantModule({
	Projectile: {},
	Explosion: {},
	Other: {},
});

export type DamageSource<T extends TypeNames<typeof DamageSource> = undefined> = VariantOf<typeof DamageSource, T>;

export enum DamageKind {
	Standard,
}
