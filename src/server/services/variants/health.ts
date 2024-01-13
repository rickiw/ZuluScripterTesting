import { Option } from "@rbxts/rust-classes";
import { DamageContributor, DamageSource } from ".";

export interface HealthChange {
	amount: number;
	by: Option<DamageContributor>;
	cause: Option<DamageSource>;
	time: number;
	crit: boolean;
}
