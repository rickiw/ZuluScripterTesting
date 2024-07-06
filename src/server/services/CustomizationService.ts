import { OnStart, Service } from "@flamework/core";
import { CharacterRigR15 } from "@rbxts/promise-character";
import { InsertService, ReplicatedStorage } from "@rbxts/services";
import { Events, Functions } from "server/network";
import { serverStore } from "server/store";
import { CharacterOptions } from "shared/constants/character";
import { PlayerProfile, setCharacterProperties } from "shared/utils";
import { PlayerDataLoaded } from "./DataService";

@Service()
export class CustomizationService implements OnStart, PlayerDataLoaded {
	setAccessories(character: CharacterRigR15, accessories: number[]) {
		accessories.forEach((assetId) => {
			const accessory = InsertService.LoadAsset(assetId).FindFirstChildOfClass("Accessory")!;
			character.GetDescendants().forEach((instance) => {
				if (instance.IsA("Accessory")) {
					instance.Destroy();
				}
			});
			character.Humanoid.AddAccessory(accessory);
		});
	}

	onStart() {
		const getBaseCharacter = () => {
			const baseCharacter = ReplicatedStorage.Assets.BaseCharacter.Clone();
			baseCharacter.Parent = ReplicatedStorage;
			baseCharacter.HumanoidRootPart.Anchored = true;

			return baseCharacter;
		};

		Functions.GetCustomizationCharacter.setCallback((player) => {
			return getBaseCharacter();
		});

		Events.SetAccessories.connect((player, character, accessories) => {
			this.setAccessories(character, accessories);
		});

		Functions.SetCharacterCustomization.setCallback((player, options) => {
			const playerCharacter = player.Character as CharacterRigR15;

			setCharacterProperties(playerCharacter, options);
			this.setAccessories(playerCharacter, options.hair);

			serverStore.updatePlayerSave(player.UserId, {
				characterOptions: { ...options, skinColor: options.skinColor.ToHex() },
			});

			return playerCharacter;
		});
	}

	playerDataLoaded(player: Player, data: PlayerProfile) {
		const characterOptions: CharacterOptions = {
			...data.characterOptions,
			skinColor: Color3.fromHex(data.characterOptions.skinColor),
		};

		const character = (player.Character || player.CharacterAdded.Wait()[0]) as CharacterRigR15;
		setCharacterProperties(character, characterOptions);
		this.setAccessories(character, characterOptions.hair);
	}
}
