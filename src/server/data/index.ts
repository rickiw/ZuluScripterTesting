export interface PlayerProfile {
	readonly logInTimes: number;
	readonly dailyLoginTimes: number;
	readonly lastLogin: number;
	readonly experience: number;
	readonly scrap: Map<string, number>;
	readonly credits: number;
}

export const defaultPlayerProfile: PlayerProfile = {
	logInTimes: 0,
	dailyLoginTimes: 0,
	lastLogin: 0,
	experience: 0,
	scrap: new Map(),
	credits: 0,
};
