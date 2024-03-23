import { FirearmDataSave } from "shared/constants/weapons";
import { PlayerProfile } from "shared/utils";

export const defaultWeaponData: FirearmDataSave = {
	"AK-105": {
		ammo: 30,
		equipped: false,
		attachments: [],
		magazine: 90,
		weaponName: "AK-105",
	},
	"AK-105S": {
		ammo: 30,
		equipped: false,
		attachments: [],
		magazine: 120,
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
	credits: 0,
};

export * from "./constants";
