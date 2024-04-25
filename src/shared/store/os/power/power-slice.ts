import { createProducer } from "@rbxts/reflex";

export interface PowerState {
	teslaGates: {
		[key: string]: boolean;
	};
	blastDoors: {
		[key: string]: boolean;
	};
	powerEnabled: boolean;
}

const initialState: PowerState = {
	teslaGates: {},
	blastDoors: {},
	powerEnabled: true,
};

export const powerSlice = createProducer(initialState, {
	setPowerEnabled: (state, powerEnabled: boolean) => ({ ...state, powerEnabled }),
	setupTeslaGates: (state, gates: string[]) => {
		const teslaGates = {} as { [key: string]: boolean };
		for (const gate of gates) {
			teslaGates[gate] = false;
		}
		return { ...state, teslaGates };
	},
	setupBlastDoors: (state, doors: string[]) => {
		const blastDoors = {} as { [key: string]: boolean };
		for (const gate of doors) {
			blastDoors[gate] = false;
		}
		return { ...state, blastDoors };
	},
	setTeslaGate: (state, name: string, enabled: boolean) => {
		const teslaGates = { ...state.teslaGates };
		teslaGates[name] = enabled;
		return { ...state, teslaGates };
	},
	setBlastDoor: (state, name: string, enabled: boolean) => {
		const blastDoors = { ...state.blastDoors };
		blastDoors[name] = enabled;
		return { ...state, blastDoors };
	},
});
