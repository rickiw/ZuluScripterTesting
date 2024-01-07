import { component } from "@rbxts/matter";
import { SpringOptions } from "@rbxts/ripple";

export const Renderable = component<{
	model: Model;
	doNotDestroy?: boolean;
}>("Renderable");
export type Renderable = ReturnType<typeof Renderable>;

export const Transform = component<{
	cf: CFrame;
	doNotReconcile?: boolean;
}>("Transform");
export type Transform = ReturnType<typeof Transform>;

export const Body = component<{ model: BaseCharacter }>("Body");
export type Body = ReturnType<typeof Body>;

export const Door = component<{
	accessLevel: false | number;
	autoClose: false | number;
	moving: boolean;
	locked: boolean;
	open: boolean;
	broken?: boolean;
	spring?: SpringOptions;
}>("Door");
export type Door = ReturnType<typeof Door>;

export const Prompt = component<{
	button: Enum.KeyCode;
	interactBegin: (player: Player) => void;
	interactEnd: (player: Player) => void;
	activated: (player: Player) => void;
}>("Prompt");
export type Prompt = ReturnType<typeof Prompt>;
