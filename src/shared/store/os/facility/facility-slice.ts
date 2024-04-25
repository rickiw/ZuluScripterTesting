import { createProducer } from "@rbxts/reflex";

export interface FacilityState {
	humeEnabled: boolean;
	seismicEnabled: boolean;
}

const initialState: FacilityState = {
	humeEnabled: true,
	seismicEnabled: true,
};

export const facilitySlice = createProducer(initialState, {
	setHumeEnabled: (state, humeEnabled: boolean) => ({ ...state, humeEnabled }),
	setSeismicEnabled: (state, seismicEnabled: boolean) => ({ ...state, seismicEnabled }),
});
