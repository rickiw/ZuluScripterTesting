import { FirearmDataSave } from "shared/constants/weapons";
import { PlayerProfile } from "shared/utils";

export const defaultWeaponData: FirearmDataSave = {
	"AK-105": {
		reserve: 30,
		equipped: false,
		attachments: [],
		magazine: 30,
		weaponName: "AK-105",
	},
	"AK-105S": {
		reserve: 30,
		equipped: false,
		attachments: [],
		magazine: 30,
		weaponName: "AK-105S",
	},
};

export const defaultPlayerProfile: PlayerProfile = {
	logInTimes: 0,
	dailyLoginStreak: 0,
	lastLogin: 0,
	experience: 0,
	clan: undefined,
	scrap: new Map(),
	purchasedPerks: [],
	objectiveCompletion: [],
	weaponData: defaultWeaponData,
	characterOptions: {
		skinColor: "#C69C6D",
		face: 144080495,
		hair: [4212534746],
		outfit: {
			shirt: 13958124520,
			pants: 13958120032,
		},
		armor: undefined,
	},
	credits: 0,
};

export * from "./constants";
