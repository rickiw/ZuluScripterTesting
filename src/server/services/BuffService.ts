import { OnStart, Service } from "@flamework/core";
import Maid from "@rbxts/maid";

export interface BuffData {
	strength: number;
	duration?: number;
}

@Service()
export class BuffService implements OnStart {
	maid = new Maid();

	onStart() {}
}
