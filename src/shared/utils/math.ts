export function round(value: number, places: number): number {
	if (places < 0) {
		return value;
	}
	const factor = 10 ** places;
	return math.round(value * factor) / factor;
}
