import { createProducer } from "@rbxts/reflex";
import { images } from "shared/assets/images";

export const TeamAbbreviations = ["FP", "SCD", "SD", "E&T", "CLASS-D", "MD", "LOGISTICS"] as const;
export type TeamAbbreviation = (typeof TeamAbbreviations)[number];

export interface Team<T extends TeamAbbreviation> {
	abbreviation: T;
	name: string;
	image: string;
	description: string;
	members: Player[];
}

export interface TeamState {
	readonly teams: {
		[key in TeamAbbreviation]: Team<key>;
	};
}

const initialState: TeamState = {
	teams: {
		FP: {
			abbreviation: "FP",
			name: "Foundation Personnel",
			image: images.ui.glyphs.FP,
			description: "Foundation Personnel are responsible for the day-to-day operations of the facility.",
			members: [],
		},
		SCD: {
			abbreviation: "SCD",
			name: "Scientific Department",
			image: images.ui.glyphs.SCD,
			description: "The Scientific Department is responsible for studying all contained and new SCP objects.",
			members: [],
		},
		SD: {
			abbreviation: "SD",
			name: "Security Department",
			image: images.ui.glyphs.SD,
			description:
				"The Security Department ensures the safety of facility staff by protecting against hostile forces and anomalies.",
			members: [],
		},
		"E&T": {
			abbreviation: "E&T",
			name: "Engineering & Technical Services",
			image: images.ui.glyphs["E&T"],
			description:
				"Engineering & Technical Services are responsible for maintaining the facility's infrastructure.",
			members: [],
		},
		"CLASS-D": {
			abbreviation: "CLASS-D",
			name: "Class-D Personnel",
			image: images.ui.glyphs.CD,
			description: "Class-D Personnel are used for testing purposes and are considered expendable.",
			members: [],
		},
		MD: {
			abbreviation: "MD",
			name: "Medical Department",
			image: images.ui.glyphs.MD,
			description: "The Medical Department is responsible for the health and well-being of facility staff.",
			members: [],
		},
		LOGISTICS: {
			abbreviation: "LOGISTICS",
			name: "Logistics Department",
			image: images.ui.glyphs.LD,
			description: "The Logistics Department is responsible for the transportation and delivery of goods.",
			members: [],
		},
	},
};

export const teamSlice = createProducer(initialState, {
	setPlayerTeam: (state, player: Player, team: TeamAbbreviation) => {
		const teams = { ...state.teams };
		for (const abbreviation of TeamAbbreviations) {
			const team = teams[abbreviation];
			team.members = team.members.filter((member) => member !== player);
		}
		teams[team].members.push(player);
		return { ...state, teams };
	},
});
