import { RootState } from "client/store";

export const selectCamera = (state: RootState) => state.camera;
export const selectCameraLock = (state: RootState) => state.camera.dontUpdate;
export const selectCameraOffset = (state: RootState) => state.camera.cameraOffset;
export const selectCameraExtraOffset = (state: RootState) => state.camera.extraCameraOffset;
export const selectCameraRecoil = (state: RootState) => state.camera.recoil;
export const selectCameraFOVOffset = (state: RootState) => state.camera.fovOffset;
export const selectCameraShiftLocked = (state: RootState) => state.camera.shiftLocked;
export const selectCameraZoomDistance = (state: RootState) => state.camera.zoomDistance;
export const selectCameraBias = (state: RootState) => state.camera.bias;
export const selectCameraLockedCenter = (state: RootState) => state.camera.lockedCenter;
export const selectCameraFlag = (id: string) => (state: RootState) => state.camera.flags[id];
