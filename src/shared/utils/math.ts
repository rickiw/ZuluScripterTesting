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

export const gaussianElimination = (input: number[][]) => {
	const matrix = input;
	const n = matrix.size();
	const solutions: number[] = [];

	for (let i = 0; i < n; i++) {
		// Search for maximum in this column
		let maxEl = math.abs(matrix[i][i]);
		let maxRow = i;
		for (let k = i + 1; k < n; k++) {
			if (math.abs(matrix[k][i]) > maxEl) {
				maxEl = math.abs(matrix[k][i]);
				maxRow = k;
			}
		}

		// Swap maximum row with current row (column by column)
		for (let k = i; k < n + 1; k++) {
			const tmp = matrix[maxRow][k];
			matrix[maxRow][k] = matrix[i][k];
			matrix[i][k] = tmp;
		}

		// Make all rows below this one 0 in current column
		for (let k = i + 1; k < n; k++) {
			const c = -matrix[k][i] / matrix[i][i];
			for (let j = i; j < n + 1; j++) {
				if (i === j) {
					matrix[k][j] = 0;
				} else {
					matrix[k][j] += c * matrix[i][j];
				}
			}
		}
	}

	// Solve equation Ax=b for an upper triangular matrix A
	for (let i = n - 1; i > -1; i--) {
		solutions[i] = matrix[i][n] / matrix[i][i];
		for (let k = i - 1; k > -1; k--) {
			matrix[k][n] -= matrix[k][i] * solutions[i];
		}
	}

	return solutions;
};

export const buildMatrixFromFactors = (factors: number[][]) => {
	return factors.map((f) => {
		const row = [];
		for (let i = factors.size() - 1; i >= 0; i--) {
			row.push(math.pow(f[0], i));
		}
		row.push(f[1]);
		return row;
	});
};

export const toScientific = (number: number): string => {
	if (number === 0) return "0";
	const coefficient = tostring(number / math.pow(10, math.floor(math.log10(math.abs(number)))));
	const exponent = tostring(math.floor(math.log10(math.abs(number))));
	return coefficient.sub(0, 4) + "*10^" + exponent;
};
