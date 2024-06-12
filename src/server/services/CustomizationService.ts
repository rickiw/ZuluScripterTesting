import { OnStart, Service } from "@flamework/core";
import Log from "@rbxts/log";
import { InsertService, ReplicatedStorage } from "@rbxts/services";
import { Events, Functions } from "server/network";

@Service()
export class CustomizationService implements OnStart {
	onStart() {
		Functions.GetCustomizationCharacter.setCallback((player) => {
			const baseCharacter = ReplicatedStorage.Assets.BaseCharacter.Clone();
			baseCharacter.Parent = ReplicatedStorage;
			baseCharacter.HumanoidRootPart.Anchored = true;

			Log.Warn("GetCustomizationCharacter | CustomizationService->onStart");

			return baseCharacter;
		});

		Events.SetAccessories.connect((player, character, accessories) => {
			accessories.forEach((assetId) => {
				const accessory = InsertService.LoadAsset(assetId).FindFirstChildOfClass("Accessory")!;
				character.GetDescendants().forEach((instance) => {
					if (instance.IsA("Accessory")) {
						instance.Destroy();
					}
				});
				character.Humanoid.AddAccessory(accessory);
			});
		});
	}
}
