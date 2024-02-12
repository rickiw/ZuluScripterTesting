import Log from "@rbxts/log";
import { CharacterRigR15 } from "@rbxts/promise-character";

export function removeTool(player: Player, toolName: string) {
	const character = (player.Character || player.CharacterAdded.Wait()[0]) as CharacterRigR15;
	character.Humanoid.UnequipTools();
	const backpack = player.FindFirstChildOfClass("Backpack")!;
	const tool = backpack.FindFirstChild(toolName);
	if (!tool) {
		Log.Warn("Couldn't remove {@Tool} from {@Player}, tool not found", toolName, player.Name);
		return;
	}
	tool.Destroy();
}

export function giveTool(player: Player, tool: ToolWithHandle, equip: boolean = true) {
	const toolClone = tool.Clone();
	const backpack = player.FindFirstChildOfClass("Backpack")!;
	toolClone.Handle.Anchored = false;
	toolClone.Parent = backpack;
	if (equip) {
		const character = (player.Character || player.CharacterAdded.Wait()[0]) as CharacterRigR15;
		character.Humanoid.EquipTool(toolClone);
	}
}
