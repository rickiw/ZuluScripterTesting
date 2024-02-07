import { ObjectUtils } from "@rbxts/variant/out/ObjectUtils";
import { Indexable } from ".";

/**
 * Replaces a property on an object with a new value. Only changes the
 * property if the value is not undefined.
 */
export function mapProperty<T extends object, K extends keyof T>(
	object: T,
	key: K,
	mapper: (value: NonNullable<T[K]>) => T[K] | undefined,
): T {
	if (object[key] !== undefined) {
		const copy = table.clone(object);
		copy[key] = mapper(object[key]!)!;
		return copy;
	}

	return object;
}

export function deepMerge(target: Indexable<string, any>, source: Indexable<string, any>) {
	for (const key of ObjectUtils.keys(source)) {
		if (typeOf(target[key]) === "table" && typeOf(source[key]) === "table") {
			target[key as string] = deepMerge(target[key], source[key]); //recursive deep merge
		} else {
			target[key] = source[key];
		}
	}

	return target;
}
