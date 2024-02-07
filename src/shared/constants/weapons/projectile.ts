import Log from "@rbxts/log";
import { DAMAGE_BALANCE_FACTORS } from "../firearm";

export type FirearmProjectileType = "Shell" | "Bullet" | "Arrow";
const DEBUG = true;

function gaussianElimination(input: number[][]) {
	const matrix = input;
	const n = matrix.size();
	const solutions: number[] = [];
	for (let i = 0; i < n; i++) {
		let maxEl = math.abs(matrix[i][i]);
		let maxRow = i;
		for (let k = i + 1; k < n; k++) {
			if (math.abs(matrix[k][i]) > maxEl) {
				maxEl = math.abs(matrix[k][i]);
				maxRow = k;
			}
		}

		for (let k = i; k < n + 1; k++) {
			const tmp = matrix[maxRow][k];
			matrix[maxRow][k] = matrix[i][k];
			matrix[i][k] = tmp;
		}
		for (let k = i + 1; k < n; k++) {
			if (matrix[i][i] !== 0) {
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
	}
	for (let i = n - 1; i > -1; i--) {
		if (matrix[i][i] !== 0) {
			solutions[i] = matrix[i][n] / matrix[i][i];
			for (let k = i - 1; k > -1; k--) {
				matrix[k][n] -= matrix[k][i] * solutions[i];
			}
		} else {
			solutions[i] = 0;
		}
	}
	return solutions;
}

function buildMatrixFromFactors(factors: number[][]) {
	return factors.map((f) => {
		const row = [];
		for (let i = factors.size() - 1; i >= 0; i--) row.push(math.pow(f[0], i));
		row.push(f[1]);
		return row;
	});
}

export interface FirearmProjectileLike {
	type: FirearmProjectileType;

	caliber?: string;
	pellets?: number;
	arrowLength?: number;
	velocity: number;
}

export interface FirearmProjectile extends FirearmProjectileLike {
	from: Vector3;
	direction: Vector3;
}

export const getCaliberData = (caliberDescriptor: string) => {
	// get the caliber descriptor. e.x: 8x70mm Huntsman
	const First = caliberDescriptor.split(" ")[0].gsub("m", "")[0];

	// the "x" in the descriptor splits the diameter and the length
	const diameterAndLength = First.split("x");

	if (!tonumber(diameterAndLength[0]))
		error(debug.traceback("Invalid projectile configuration: the diameter of the bullet is not a number"));
	if (!tonumber(diameterAndLength[1]))
		error(debug.traceback("Invalid projectile configuration: the length of the bullet is not a number"));

	return {
		diameter: tonumber(diameterAndLength[0]) as number,
		length: tonumber(diameterAndLength[1]) as number,
	};
};

export const balancedDamageFunction = (volume: number) => {
	const factorMatrix = buildMatrixFromFactors(DAMAGE_BALANCE_FACTORS);
	const solutions = gaussianElimination(factorMatrix);

	let result = 0;
	for (let i = 0; i < solutions.size() - 1; i++) {
		result += solutions[i] * math.pow(volume, solutions.size() - 1 - i);
	}
	result += solutions[solutions.size() - 1];

	// Building formula string
	if (DEBUG) {
		const terms = [];
		for (let i = 0; i < solutions.size() - 1; i++) {
			terms.push(`${string.format("%.16f", solutions[i])} * x^${solutions.size() - 1 - i}`);
		}
		terms.push(tostring(string.format("%.16f", solutions[solutions.size() - 1]))); // The constant term
		const formula = terms.join(" + ");

		Log.Info("Formula {@Formula}", formula); // Print the formula
	}

	return math.clamp(math.round(result * 10) / 10, 0, 100);
};

export const getGunDamage = (projectile: FirearmProjectile): number => {
	if (projectile.type === "Bullet" && projectile.caliber) {
		const data = getCaliberData(projectile.caliber);
		const volume = data.diameter * data.length;
		return balancedDamageFunction(volume);
	} else if (projectile.type === "Shell" && projectile.caliber && projectile.pellets) {
		// a 12 pellet slug would be 150 damage (if all shots are hit)
		const data = getCaliberData(projectile.caliber);

		const volume = math.pi * math.pow(data.diameter / 2, 2) * data.length;
		const damagePerPellet = (15 / 361) * volume;
		const totalDamage = damagePerPellet * projectile.pellets;

		// Cap total Damage at 150
		return math.min(totalDamage, 150);
	}

	// get Arrow specifics, a 10x508mm arrow would be 45 damage
	const data = getCaliberData(projectile.caliber as string);

	// calculate damage the same way as for the bullets
	const volume = math.pi * math.pow(data.diameter / 2, 2) * data.length;
	const damage = (45 / (10 * 508)) * volume; // using 10*508mm arrow info

	// you can cap the damage at a specific value to prevent overkill
	return math.min(damage, 100); // assuming cap to be 100
};
