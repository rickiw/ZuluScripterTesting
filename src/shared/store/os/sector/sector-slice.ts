import { createProducer } from "@rbxts/reflex";
import { SectorStatus } from "shared/constants/os";

export interface SectorState {
	[key: string]: SectorStatus;
}

const initialState: SectorState = {
	sector1: SectorStatus.Nominal,
	sector2: SectorStatus.Nominal,
	sector3: SectorStatus.Nominal,
};

export const sectorSlice = createProducer(initialState, {
	setSectorStatus: (state, sector: string, status: SectorStatus) => ({ ...state, [sector]: status }),
});
