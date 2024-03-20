class ConstrainedSpring {
	freq: number;
	x: number;
	v: number;
	minValue: number;
	maxValue: number;
	goal: number;

	constructor(freq: number, x: number, minValue: number, maxValue: number) {
		x = math.clamp(x, minValue, maxValue);
		this.freq = freq;
		this.x = x;
		this.v = 0;
		this.minValue = minValue;
		this.maxValue = maxValue;
		this.goal = x;
	}

	Step(dt: number) {
		const freq = this.freq;
	}
}

class Zoom {
	Update(renderDt: number, focus: CFrame, extrapolation: TransformExtrapolator) {
		const poppedZoom = math.huge;
	}
}

class BaseOcclusion {}

class TransformExtrapolator {
	CF_IDENTITY = new CFrame();
	lastCFrame?: CFrame;

	constructor() {}

	private cframeToAxis(cframe: CFrame) {
		const [axis, angle] = cframe.ToAxisAngle();
		return axis.mul(angle);
	}

	private axisToCFrame(axis: Vector3) {
		const angle = axis.Magnitude;
		if (angle > 1e-5) {
			return CFrame.fromAxisAngle(axis, angle);
		}
		return this.CF_IDENTITY;
	}

	private extractRotation(cf: CFrame) {
		const [, , , xx, xy, xz, yx, yy, yz, zx, zy, zz] = cf.GetComponents();
		return new CFrame(0, 0, 0, xx, xy, xz, yx, yy, yz, zx, zy, zz);
	}

	Step(dt: number, currentCFrame: CFrame) {
		const lastCFrame = this.lastCFrame || currentCFrame;
		this.lastCFrame = currentCFrame;

		const currentPos = currentCFrame.Position;
		const currentRot = this.extractRotation(currentCFrame);

		const lastPos = lastCFrame.Position;
		const lastRot = this.extractRotation(lastCFrame);

		const dp = currentPos.sub(lastPos).div(dt);
		const dr = this.cframeToAxis(currentRot.mul(lastRot.Inverse())).div(dt);

		const extrapolate = (t: number) => {
			const p = dp.mul(t).add(currentPos);
			const r = this.axisToCFrame(dr.mul(t)).mul(currentRot);
			return r.add(p);
		};

		return {
			extrapolate,
			posVelocity: dp,
			rotVelocity: dr,
		};
	}

	Reset() {
		this.lastCFrame = undefined;
	}
}

class Poppercam extends BaseOcclusion {
	focusExtrapolator = new TransformExtrapolator();

	constructor() {
		super();
	}

	GetOcclusionMode() {
		return Enum.DevCameraOcclusionMode.Zoom;
	}

	Enable() {
		this.focusExtrapolator.Reset();
	}

	Update(renderDt: number, desiredCameraCFrame: CFrame, desiredCameraFocus: CFrame) {
		const rotatedFocus = new CFrame(desiredCameraFocus.Position, desiredCameraCFrame.Position).mul(
			new CFrame(0, 0, 0, -1, 0, 0, 0, 1, 0, 0, 0, -1),
		);
		const extrapolation = this.focusExtrapolator.Step(renderDt, rotatedFocus);
	}
}
