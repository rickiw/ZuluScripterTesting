import { createProducer } from "@rbxts/reflex";
import { Indexable } from "shared/utils";

export interface CameraState {
	cameraOffset: Vector3;
	fovOffset: number;
	shiftLocked: boolean;
	distance: number;
	lockedCenter: boolean;
	dontUpdate: boolean;

	flags: Indexable<string, number | boolean | string>;
}

const initialState: CameraState = {
	cameraOffset: Vector3.zero,
	fovOffset: 0,
	shiftLocked: false,
	distance: 8,
	lockedCenter: false,
	flags: {},
	dontUpdate: false,
};

export const cameraSlice = createProducer(initialState, {
	setCameraOffset: (state, cameraOffset) => ({
		...state,
		cameraOffset,
	}),

	setFovOffset: (state, fovOffset) => ({
		...state,
		fovOffset,
	}),

	setShiftLocked: (state, shiftLocked) => ({
		...state,
		shiftLocked,
	}),

	setCameraDistance: (state, distance) => ({
		...state,
		distance,
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
