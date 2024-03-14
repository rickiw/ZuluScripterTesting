export function CFrameToAngles(cframe: CFrame) {
	return cframe.sub(cframe.Position);
}

export function rotateCFrameAroundWorldAxis(cframe: CFrame, worldAxis: Vector3, amount: number) {
	const objectAxis = cframe.VectorToObjectSpace(worldAxis);
	return cframe.mul(CFrame.fromAxisAngle(objectAxis, amount));
}

export function rotateCFrameCameraLike(cframe: CFrame, dPitch: number, dYaw: number) {
	cframe = rotateCFrameAroundWorldAxis(cframe, new Vector3(0, 1, 0), dYaw);
	cframe = cframe.mul(CFrame.Angles(dPitch, 0, 0));
	return cframe;
}

export function getCFramePitch(cframe: CFrame) {
	const lv = cframe.LookVector;
	const py = lv.Y;
	const px = new Vector3(lv.X, 0, lv.Z).Magnitude;
	return math.atan2(py, px);
}

export function constrainAngles(angles: CFrame, pitchLimits: NumberRange) {
	const unlimitedCFrame = angles;
	let limitedCframe = unlimitedCFrame;

	const newPitch = getCFramePitch(unlimitedCFrame);

	if (newPitch > pitchLimits.Max) {
		const extraPitch = newPitch - pitchLimits.Max;
		limitedCframe = rotateCFrameCameraLike(limitedCframe, -extraPitch, 0);
	} else if (newPitch < pitchLimits.Min) {
		const missingPitch = pitchLimits.Min - newPitch;
		limitedCframe = rotateCFrameCameraLike(limitedCframe, missingPitch, 0);
	}

	return limitedCframe;
}
