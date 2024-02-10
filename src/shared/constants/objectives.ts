import { Objective, SpecifiedObjective } from "shared/store/objectives";

export const FPObjectives: SpecifiedObjective<"FP">[] = [
	{
		id: 1,
		priority: 1,
		category: "FP",
		name: "Get worker his coffee",
		description: "N/A",
		location: new Vector3(0, 0, 0),
		reward: [100, "credits"],
	},
	{
		id: 2,
		priority: 1,
		category: "FP",
		name: "Deliver paperwork",
		description: "N/A",
		location: new Vector3(0, 0, 0),
		reward: [100, "credits"],
	},
	{
		id: 3,
		priority: 1,
		category: "FP",
		name: "Blackout keywords on research report",
		description: "N/A",
		location: new Vector3(0, 0, 0),
		reward: [100, "credits"],
	},
	{
		id: 4,
		priority: 1,
		category: "FP",
		name: "Cook and serve food at cafeterias",
		description: "N/A",
		location: new Vector3(0, 0, 0),
		reward: [100, "credits"],
	},
];

export const SCDObjectives: SpecifiedObjective<"SCD">[] = [
	{
		id: 5,
		priority: 1,
		category: "SCD",
		name: "Spot amoeba mini game",
		description: "N/A",
		location: new Vector3(0, 0, 0),
		reward: [100, "credits"],
	},
	{
		id: 6,
		priority: 1,
		category: "SCD",
		name: "Deliver research reports to office",
		description: "N/A",
		location: new Vector3(0, 0, 0),
		reward: [100, "credits"],
	},
	{
		id: 7,
		priority: 1,
		category: "SCD",
		name: "Conduct research",
		description: "N/A",
		location: new Vector3(0, 0, 0),
		reward: [100, "credits"],
	},
];

export const SDObjectives: SpecifiedObjective<"SD">[] = [
	{
		id: 8,
		priority: 1,
		category: "SD",
		name: "Patrol corridor quest",
		description: "N/A",
		location: new Vector3(0, 0, 0),
		reward: [100, "credits"],
		completion: {
			steps: 0,
		},
	},
	{
		id: 9,
		priority: 1,
		category: "SD",
		name: "Guard CDC quest",
		description: "N/A",
		location: new Vector3(0, 0, 0),
		reward: [100, "credits"],
	},
	{
		id: 10,
		priority: 1,
		category: "SD",
		name: "File facility reports",
		description: "N/A",
		location: new Vector3(0, 0, 0),
		reward: [100, "credits"],
	},
];

export const EAndTObjectives: SpecifiedObjective<"E&T">[] = [
	{
		id: 11,
		priority: 1,
		category: "E&T",
		name: "Fix wiring",
		description: "N/A",
		location: new Vector3(0, 0, 0),
		reward: [100, "credits"],
	},
	{
		id: 12,
		priority: 1,
		category: "E&T",
		name: "Deliver tool chest",
		description: "N/A",
		location: new Vector3(0, 0, 0),
		reward: [100, "credits"],
	},
];

export const ClassDObjectives: SpecifiedObjective<"CLASS-D">[] = [
	{
		id: 13,
		priority: 1,
		category: "CLASS-D",
		name: "Sweep floor",
		description: "N/A",
		location: new Vector3(0, 0, 0),
		reward: [100, "credits"],
	},
	{
		id: 14,
		priority: 1,
		category: "CLASS-D",
		name: "Do X pullups on the bar",
		placeholders: { X: 10 },
		description: "N/A",
		location: new Vector3(0, 0, 0),
		reward: [100, "credits"],
	},
	{
		id: 15,
		priority: 1,
		category: "CLASS-D",
		name: "Make food",
		description: "N/A",
		location: new Vector3(0, 0, 0),
		reward: [100, "credits"],
	},
	{
		id: 16,
		priority: 1,
		category: "CLASS-D",
		name: "Kill X security",
		placeholders: { X: 10 },
		description: "N/A",
		location: new Vector3(0, 0, 0),
		reward: [100, "credits"],
	},
	{
		id: 17,
		priority: 1,
		category: "CLASS-D",
		name: "Kill X Mobile Task Forces",
		placeholders: { X: 10 },
		description: "N/A",
		location: new Vector3(0, 0, 0),
		reward: [100, "credits"],
	},
];

export const MDObjectives: SpecifiedObjective<"MD">[] = [
	{
		id: 18,
		priority: 1,
		category: "MD",
		name: "Conduct Research",
		description: "N/A",
		location: new Vector3(0, 0, 0),
		reward: [100, "credits"],
	},
	{
		id: 19,
		priority: 1,
		category: "MD",
		name: "Report Checkup Documents",
		description: "N/A",
		location: new Vector3(0, 0, 0),
		reward: [100, "credits"],
	},
];

export const LogisticsObjectives: SpecifiedObjective<"LOGISTICS">[] = [
	{
		id: 20,
		priority: 1,
		category: "LOGISTICS",
		name: "Deliver crates",
		description: "N/A",
		location: new Vector3(0, 0, 0),
		reward: [100, "credits"],
	},
	{
		id: 21,
		priority: 1,
		category: "LOGISTICS",
		name: "Restock supplies",
		description: "N/A",
		location: new Vector3(0, 0, 0),
		reward: [100, "credits"],
	},
];

export const objectives: Objective[] = [
	...FPObjectives,
	...SCDObjectives,
	...SDObjectives,
	...EAndTObjectives,
	...ClassDObjectives,
	...MDObjectives,
	...LogisticsObjectives,
];
