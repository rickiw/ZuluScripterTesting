import { PlayerProfile } from "shared/store/saves";

export const defaultPlayerProfile: PlayerProfile = {
	logInTimes: 0,
	dailyLoginTimes: 0,
	lastLogin: 0,
	experience: 0,
	scrap: new Map(),
	credits: 0,
};

export * from "./constants";
