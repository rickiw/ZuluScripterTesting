import { Service } from "@flamework/core";

@Service()
export class DoorService {
	getOffsetCFrame(originCFrame: CFrame, offset: Vector3, value: number) {
		return originCFrame.Lerp(originCFrame.mul(new CFrame(offset)), value);
	}

	getNegativeOffsetCFrame(originCFrame: CFrame, offset: Vector3, value: number) {
		return originCFrame.Lerp(originCFrame.mul(new CFrame(offset.mul(-1))), value);
	}

	getAngleCFrame(originCFrame: CFrame, amount: number, value: number) {
		return originCFrame.Lerp(originCFrame.mul(CFrame.Angles(0, math.pi / amount, 0)), value);
	}

	getNegativeAngleCFrame(originCFrame: CFrame, amount: number, value: number) {
		return originCFrame.Lerp(originCFrame.mul(CFrame.Angles(0, -math.pi / amount, 0)), value);
	}
}
