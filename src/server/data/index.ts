import { PlayerProfile } from "shared/utils";

export const defaultPlayerProfile: PlayerProfile = {
	logInTimes: 0,
	dailyLoginStreak: 0,
	lastLogin: 0,
	experience: 0,
	clan: undefined,
	scrap: new Map(),
	purchasedPerks: [],
	objectiveCompletion: [],
	weaponData: [],
	credits: 0,
};

export * from "./constants";
