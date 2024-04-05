import { createProducer } from "@rbxts/reflex";
import { Indexable } from "shared/utils";

export interface CameraState {
	cameraOffset: Vector3;
	extraCameraOffset: Vector3;
	recoil: CFrame;
	fovOffset: number;
	shiftLocked: boolean;
	zoomDistance: number;
	lockedCenter: boolean;
	dontUpdate: boolean;
	bias: { left: boolean; right: boolean };

	flags: Indexable<string, number | boolean | string>;
}

const initialState: CameraState = {
	cameraOffset: Vector3.zero,
	extraCameraOffset: Vector3.zero,
	recoil: new CFrame(),
	fovOffset: 0,
	shiftLocked: false,
	zoomDistance: 8,
	lockedCenter: false,
	bias: { left: true, right: false },
	flags: {},
	dontUpdate: false,
};

export const cameraSlice = createProducer(initialState, {
	setCameraOffset: (state, cameraOffset) => ({
		...state,
		cameraOffset,
	}),
	setRecoil: (state, recoil) => ({
		...state,
		recoil,
	}),
	setExtraCameraOffset: (state, extraCameraOffset) => ({
		...state,
		extraCameraOffset,
	}),
	setFovOffset: (state, fovOffset) => ({
		...state,
		fovOffset,
	}),
	setShiftLocked: (state, shiftLocked) => ({
		...state,
		shiftLocked,
	}),
	setCameraBias: (state, bias) => ({
		...state,
		bias,
	}),
	setCameraZoomDistance: (state, zoomDistance) => ({
		...state,
		zoomDistance,
	}),
	setCameraLockedCenter: (state, lockedCenter) => ({
		...state,
		lockedCenter,
	}),
	setCameraLock: (state, lock) => ({
		...state,
		dontUpdate: lock,
	}),
	setCameraFlag: (state, flag: string, value: number | string | boolean) => ({
		...state,
		flags: {
			...state.flags,
			[flag]: value,
		},
	}),
});
