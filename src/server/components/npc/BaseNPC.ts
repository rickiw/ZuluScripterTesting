import { BaseComponent, Component } from "@flamework/components";

interface NPCInstance extends Model {}

interface NPCAttributes {}

@Component({
	tag: "baseNPC",
})
export class BaseNPC<A extends NPCAttributes, I extends NPCInstance> extends BaseComponent<A, I> {}
