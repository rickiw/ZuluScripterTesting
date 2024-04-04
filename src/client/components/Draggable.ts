import { BaseComponent, Component } from "@flamework/components";
import { OnStart } from "@flamework/core";

export interface DraggableAttributes {}

export interface DraggableInstance extends ViewportFrame {
	Camera: Camera;
}

@Component({
	tag: "draggableViewport",
})
export class Draggable<A extends DraggableAttributes, I extends DraggableInstance>
	extends BaseComponent<A, I>
	implements OnStart
{
	model?: Model;

	onStart() {
		print("Component mounted");
	}

	setModel(model: Model) {
		this.model = model;
	}
}
