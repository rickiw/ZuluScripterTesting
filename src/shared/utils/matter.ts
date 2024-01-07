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
