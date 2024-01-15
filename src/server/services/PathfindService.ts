import { Service } from "@flamework/core";
import { TweenService } from "@rbxts/services";

@Service()
export class PathfindService {
	tween(part: BasePart, destination: Vector3) {
		return TweenService.Create(part, new TweenInfo(0.7), { Position: destination });
	}
}
