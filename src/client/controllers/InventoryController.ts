import { Components } from "@flamework/components";
import { Controller, Dependency, OnStart } from "@flamework/core";
import Log from "@rbxts/log";
import { CharacterRigR15 } from "@rbxts/promise-character";
import { Players, UserInputService } from "@rbxts/services";
import { BaseFirearm } from "client/components/BaseFirearm";
import { clientStore } from "client/store";
import { selectInventoryItems } from "client/store/inventory";
import { HandlesInput } from "./BaseInput";

const player = Players.LocalPlayer;
const character = (player.Character || player.CharacterAdded.Wait()[0]) as CharacterRigR15;

@Controller()
export class InventoryController extends HandlesInput implements OnStart {
	inputs = [Enum.KeyCode.N];

	constructor() {
		super();
	}

	onStart() {
		const backpack = player.FindFirstChildOfClass("Backpack");
		if (!backpack) {
			Log.Warn("No backpack found");
			return;
		}

		UserInputService.InputBegan.Connect((input) => {
			if (this.hasInput(input.KeyCode)) {
				Log.Warn("Inventory: {@Inventory}", selectInventoryItems(clientStore.getState()));
			}
		});

		const components = Dependency<Components>();
		backpack
			.GetChildren()
			.filter((item) => item.IsA("Tool"))
			.forEach((item) => {
				clientStore.addInventoryItem(item as Tool);
				const baseFirearmComponent = components.getComponent<BaseFirearm<any, any>>(item);
				if (baseFirearmComponent) {
					// clientStore.addInventoryItem(baseFirearmComponent);
				} else {
					Log.Warn("No BaseFirearm component found on tool");
				}
			});

		backpack.ChildAdded.Connect((item) => {
			if (!item.IsA("Tool")) {
				return;
			}
			const baseFirearmComponent = components.getComponent<BaseFirearm<any, any>>(item);
			clientStore.addInventoryItem(item);
			if (baseFirearmComponent) {
				// clientStore.addInventoryItem(baseFirearmComponent);
			}
		});
		backpack.ChildRemoved.Connect((item) => {
			if (!item.IsA("Tool")) {
				return;
			}
			const baseFirearmComponent = components.getComponent<BaseFirearm<any, any>>(item);
			clientStore.removeInventoryItem(item);
			if (baseFirearmComponent) {
				// clientStore.removeInventoryItem(baseFirearmComponent);
			}
		});
	}
}
