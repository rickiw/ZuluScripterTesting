import Log from "@rbxts/log";
import { CharacterRigR15 } from "@rbxts/promise-character";
import { GroupID } from "shared/constants/clans";
import { FirearmDataSave } from "shared/constants/weapons";
import { ObjectiveSave } from "shared/store/objectives";
import { PerkInfo } from "shared/store/perks";

export interface PlayerProfile {
	readonly logInTimes: number;
	readonly dailyLoginStreak: number;
	readonly lastLogin: number; // TODO: consider using a serialized DateTime string here
	readonly experience: number;
	readonly clan: GroupID | undefined;
	readonly purchasedPerks: ReadonlyArray<PerkInfo>;
	readonly objectiveCompletion: ReadonlyArray<ObjectiveSave>;
	readonly weaponData: FirearmDataSave;
	readonly scrap: Map<string, number>;
	readonly credits: number;
}

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
