import { PlayerProfile } from "shared/data/slices/state/saves";

export const defaultPlayerProfile: PlayerProfile = {
	logInTimes: 0,
	dailyLoginTimes: 0,
	lastLogin: 0,
	experience: 0,
	scrap: new Map(),
	credits: 0,
};
