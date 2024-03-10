import { RootState } from "client/store";

export const selectCamera = (state: RootState) => state.camera;
export const selectCameraLock = (state: RootState) => state.camera.dontUpdate;
export const selectCameraOffset = (state: RootState) => state.camera.cameraOffset;
export const selectCameraFOVOffset = (state: RootState) => state.camera.fovOffset;
export const selectCameraShiftLocked = (state: RootState) => state.camera.shiftLocked;
export const selectCameraDistance = (state: RootState) => state.camera.distance;
export const selectCameraLockedCenter = (state: RootState) => state.camera.lockedCenter;
export const selectCameraFlag = (id: string) => (state: RootState) => state.camera.flags[id];
