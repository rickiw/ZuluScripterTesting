export interface SoundDict {
	[index: string]: number;
}

export interface ManagedSound {
	sound: Sound;
	inUse: boolean;
}
