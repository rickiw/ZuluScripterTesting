import { Controller } from "@flamework/core";
import Octree from "@rbxts/octo-tree";
import { Workspace } from "@rbxts/services";
import { On1SecondInterval } from "./BaseController";

export interface SimNodeInfo {
	callback: (state: boolean) => void;
	type: "angularMotion" | "flash" | "door";
}

@Controller()
export class SimulationController implements On1SecondInterval {
	simulationTree: Octree<SimNodeInfo>;
	camera: Camera;
	simulationDistance: number;
	simulationNodes: Octree.Node<SimNodeInfo>[];

	constructor() {
		this.simulationTree = new Octree();
		this.camera = Workspace.CurrentCamera!;
		this.simulationDistance = 150;
		this.simulationNodes = [];
	}

	on1SecondInterval() {
		const newNodesInSimulation: Octree.Node<SimNodeInfo>[] = [];
		for (const node of this.simulationTree.GetNearest(this.camera.CFrame.Position, this.simulationDistance, 50)) {
			if (!node || !node.Object || !node.Object.callback) continue;
			if (!this.simulationNodes.includes(node)) {
				this.simulationNodes.push(node);
				node.Object.callback(true);
			}
			newNodesInSimulation.push(node);
		}
		for (const val of this.simulationNodes) {
			if (!newNodesInSimulation.includes(val)) {
				if (!val || !val.Object || !val.Object.callback) {
					this.simulationNodes.remove(
						this.simulationNodes.findIndex((node) => {
							return val === node;
						}),
					);
					continue;
				}
				val.Object.callback(false);
				this.simulationNodes.remove(
					this.simulationNodes.findIndex((node) => {
						return val === node;
					}),
				);
			}
		}
	}

	registerSimulatedObject(position: Vector3, simNodeInfo: SimNodeInfo) {
		return this.simulationTree.CreateNode(position, simNodeInfo);
	}

	unregisterSimulatedObject(node: Octree.Node<SimNodeInfo>) {
		this.simulationTree.RemoveNode(node);
	}
}
