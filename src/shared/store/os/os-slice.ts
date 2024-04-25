import { combineProducers } from "@rbxts/reflex";
import { audioSlice } from "./audio/audio-slice";
import { facilitySlice } from "./facility";
import { fileSlice } from "./file";
import { powerSlice } from "./power";
import { sectorSlice } from "./sector";

export const osSlice = combineProducers({
	file: fileSlice,
	facility: facilitySlice,
	audio: audioSlice,
	sector: sectorSlice,
	power: powerSlice,
});
