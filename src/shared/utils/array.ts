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

export type Indexable<K extends string | number | symbol, V> = { [P in K]: V };
