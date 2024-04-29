import { SharedState } from "../..";

export const selectHumeStatus = (state: SharedState) => state.os.facility.humeEnabled;
export const selectSeismicStatus = (state: SharedState) => state.os.facility.seismicEnabled;
