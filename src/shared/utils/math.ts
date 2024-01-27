export function round(value: number, places: number): number {
	if (places < 0) {
		return value;
	}
	const factor = 10 ** places;
	return math.round(value * factor) / factor;
}

export function damp(rate: number, delta: number) {
	return 1 - math.exp(-rate * delta);
}

export function lerp(a: number, b: number, t: number) {
	return a + (b - a) * t;
}

export const toScientific = (number: number): string => {
	if (number === 0) return "0";
	const coefficient = tostring(number / math.pow(10, math.floor(math.log10(math.abs(number)))));
	const exponent = tostring(math.floor(math.log10(math.abs(number))));
	return coefficient.sub(0, 4) + " * 10^" + exponent;
};
