import Log from "@rbxts/log";
import { AnyEntity, World } from "@rbxts/matter";
import { ComponentCtor } from "@rbxts/matter/lib/component";

export type BaseEntity<T extends ComponentCtor> = {
	id: AnyEntity;
} & ReturnType<T>;

export type Entity<T extends ComponentCtor> = BaseEntity<T> & { wrap: ReturnType<T> };

export function fetchComponent<T extends ComponentCtor>(world: World, id: AnyEntity, component: T): Entity<T> {
	const _component = getOrError(world, id, component, "Component {@Component} does not exist", "error", component);
	return _component;
}

export function getOrError<T extends ComponentCtor>(
	world: World,
	id: AnyEntity,
	component: T,
	errorMessage: string = "",
	logType: "warn" | "info" | "error" = "error",
	...args: object[]
): Entity<T> {
	if (!world.contains(id)) throw `World does not contain entity - ${errorMessage}`;
	const componentInstance = world.get(id, component);

	if (!componentInstance) {
		if (logType === "error") Log.Error(errorMessage, args);
		else if (logType === "warn") Log.Warn(errorMessage, args);
		else Log.Info(errorMessage, args);
		throw errorMessage;
	}
	return { id, wrap: componentInstance, ...componentInstance };
}

export function slice<TValue extends defined>(array: ReadonlyArray<TValue>, start = 0, endPos = array.size()) {
	if (start < 0) {
		start = array.size() + start;
		endPos = array.size();
	}

	if (endPos < 0) {
		endPos = array.size() + endPos;
	}

	return array.move(math.max(0, start), endPos - 1, 0, []);
}

export function weightedRandomIndex<T extends object>(array: Array<{ weight: number; type: T }>) {
	let totalWeight = 0;
	const weights = new Map<number, T>();
	for (const item of array) {
		totalWeight += item.weight;
		for (let i = 0; i < item.weight; i++) {
			const nextAvailableIndex = weights.size() + 1;
			weights.set(nextAvailableIndex, item.type);
		}
	}
	const random = math.random(1, totalWeight);
	const utilityType = weights.get(random);
	if (!utilityType) throw `Utility type not found for random number ${random}`;

	return utilityType;
}

export function randomIndex<T>(array: Array<T>) {
	return array[math.random(1, array.size()) - 1];
}
