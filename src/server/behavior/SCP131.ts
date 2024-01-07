import Maid from "@rbxts/maid";
import { Queue } from "@rbxts/stacks-and-queues";
import { SCPBehaviorProps } from ".";

type SCP131State = "idle" | "wandering" | "following";

const SCP_STATE: SCP131State = "idle";

interface SCPEvent {
	type: "spawn";
}

const queue = new Queue<SCPEvent>();
const maid = new Maid();

export function SCP131Behavior({ world }: SCPBehaviorProps) {
	queue.push({ type: "spawn" });

	function runSCPLoop() {
		task.wait(1);
		const event = queue.pop();

		if (!event) {
			runSCPLoop();
			return;
		}

		switch (event.type) {
			case "spawn": {
				break;
			}
		}
	}
}
