import { createProducer } from "@rbxts/reflex";

type ObjectiveNamesByCategory = {
	FP:
		| "Get worker his coffee"
		| "Deliver paperwork"
		| "Blackout keywords on research report"
		| "Cook and serve food at cafeterias";
	SCD: "Spot amoeba mini game" | "Deliver research reports to office" | "Conduct research";
	SD: "Patrol corridor quest" | "Guard CDC quest" | "File facility reports";
	"E&T": "Fix wiring" | "Deliver tool chest";
	"CLASS-D":
		| "Sweep floor"
		| "Do X pullups on the bar"
		| "Make food"
		| "Kill X security"
		| "Kill X Mobile Task Forces";
	MD: "Conduct Research" | "Report Checkup Documents";
	LOGISTICS: "Deliver crates" | "Restock supplies";
};

export type ObjectiveCategory = Prettify<keyof ObjectiveNamesByCategory>;
export type ObjectiveName = ObjectiveNamesByCategory[ObjectiveCategory];
export type ObjectiveID = number;

export interface Objective extends Partial<ObjectiveSave> {
	readonly id: ObjectiveID;
	readonly category: ObjectiveCategory;
	readonly name: ObjectiveName;
	readonly priority: 1 | 2 | 3;
	readonly description: string;
	readonly location: Vector3;
	readonly reward: [amount: number, currency: "credits" | "scrap"];
	readonly placeholders?: Record<string, unknown>;
}

export interface ObjectiveSave {
	readonly id: ObjectiveID;
	readonly completion: Record<string, unknown>;
}

export interface SpecifiedObjective<T extends ObjectiveCategory> extends Objective {
	readonly category: T;
	readonly name: ObjectiveNamesByCategory[T];
}

export interface ObjectivesState {
	readonly [id: number]: Objective | undefined;
}

const initialState: ObjectivesState = {};

export const objectivesSlice = createProducer(initialState, {
	setObjective: (state, id: number, objective: Objective) => ({
		...state,
		[id]: objective,
	}),
	deleteObjective: (state, id: number) => ({
		...state,
		[id]: undefined,
	}),
	updateObjective: (state, id: number, update: Partial<Objective>) => ({
		...state,
		[id]: {
			...state[id]!,
			...update,
		},
	}),
});
