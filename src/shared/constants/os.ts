export enum FacilityAlarmCode {
	"RED" = "RED",
	"BLUE" = "BLUE",
	"GREEN" = "GREEN",
	"SUPERBLUE" = "SUPERBLUE",
	"BLACK" = "BLACK",
	"WHITE" = "WHITE",
}

export enum FacilityAnnouncement {
	"Cafeteria" = "Cafeteria",
	"Opsec" = "Opsec",
	"Seminar" = "Seminar",
	"Suspicious" = "Suspicious",
}

export enum SectorStatus {
	"Nominal" = "Nominal",
	"GOI Threat" = "GOI Threat",
	"Anomalous Threat" = "Anomalous Threat",
}

export interface OSDocument {
	filename: string;
	contents: string;
	author: string;
	created?: string;
	updated?: string;
}

export const OSGuidelines: OSDocument[] = [
	{
		filename: "DOCUMENT ONE",
		contents: "This is the first document.",
		author: "O5-1",
	},
	{
		filename: "DOCUMENT TWO",
		contents: "This is the first document.",
		author: "O5-1",
	},
	{
		filename: "DOCUMENT THREE",
		contents: "This is the first document.",
		author: "O5-1",
	},
];
