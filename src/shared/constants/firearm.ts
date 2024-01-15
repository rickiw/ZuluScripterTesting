import PartCacheModule from "@rbxts/partcache";
import { ReplicatedStorage } from "@rbxts/services";

export const BULLET_TEMPLATE = ReplicatedStorage.WaitForChild("Bullet", 1) as BasePart;
export const BULLET_PROVIDER = new PartCacheModule(BULLET_TEMPLATE, 1);

export const DAMAGE_BALANCE_FACTORS = [
	// 9x19mm does 12 dmg
	[9 * 19, 12],

	// .45 does 12.5 dmg
	[11.43 * 23, 12.5],

	// 5.56x45 does 16 dmg
	[5.56 * 45, 16],

	// 7.62x39mm does 17.5 dmg
	[7.62 * 39, 17.5],

	// 7.62x51mm does 22.5 dmg
	[7.62 * 51, 22.5],

	// 8x70mm does 100 dmg
	[8 * 70, 100],

	// No way
	[20 * 138, 250],
].sort((a, b) => a[0] < b[0]);
