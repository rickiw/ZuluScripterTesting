import { config, SpringOptions } from "@rbxts/ripple";

export const springs = {
	...config.spring,
	bubbly: { tension: 400, friction: 14 },
	responsive: { tension: 400 },
	orbit: { tension: 330 },
	gentle: { tension: 250, friction: 30 },
	world: { tension: 180, friction: 30 },
	singleHeavyDoor: { tension: 280 * 2, friction: 420 * 2 },
	heavyDoor: { tension: 280, friction: 420 },
	superHeavyDoor: { tension: 120, friction: 880 },
} satisfies { [config: string]: SpringOptions };
