import { Controller, OnRender, OnStart } from "@flamework/core";
import Log from "@rbxts/log";
import { CharacterRigR15 } from "@rbxts/promise-character";
import { Players, ReplicatedStorage, UserInputService } from "@rbxts/services";
import { Functions } from "client/network";
import { clientStore } from "client/store";
import {
	CharacterOptions,
	selectCharacterCustomizationModel,
	selectCharacterOptions,
	selectCustomizationPage,
} from "client/store/customization";

const player = Players.LocalPlayer;
const mouse = player.GetMouse();

@Controller()
export class CharacterCustomizationController implements OnStart, OnRender {
	modelCharacter?: CharacterRigR15;
	lastMousePosition?: Vector2;
	moved = Vector2.zero;
	dragging = false;

	onStart() {}

	private setCharacterProperties(character: CharacterRigR15, options: CharacterOptions) {
		character["Body Colors"].HeadColor3 = options.skinColor;
		character["Body Colors"].TorsoColor3 = options.skinColor;
		character["Body Colors"].LeftArmColor3 = options.skinColor;
		character["Body Colors"].LeftLegColor3 = options.skinColor;
		character["Body Colors"].RightArmColor3 = options.skinColor;
		character["Body Colors"].RightLegColor3 = options.skinColor;

		const face = character.Head.FindFirstChildOfClass("Decal");
		if (face) {
			face.Texture = `http://www.roblox.com/asset/?id=${options.face}`;
		}

		character.GetDescendants().forEach((instance) => {
			if (instance.IsA("Accessory")) {
				instance.Destroy();
			}
		});

		options.hair.forEach((hairId) => {
			const [success, hairAsset] = Functions.GetAssetAccessory.invoke(hairId).await();

			if (!success) {
				Log.Warn("Failed to get hair asset {@AssetID}", hairId);
				return;
			}

			const hair = hairAsset.Clone();
			character.Humanoid.AddAccessory(hair);
		});
	}

	updateCharacter(options: CharacterOptions) {
		const baseCharacter = clientStore.getState(selectCharacterCustomizationModel);
		const character = baseCharacter ?? this.buildCharacter(options);

		this.setCharacterProperties(character, options);

		return character;
	}

	buildCharacter(options: CharacterOptions) {
		const baseCharacter = ReplicatedStorage.Assets.BaseCharacter.Clone();
		this.setCharacterProperties(baseCharacter, options);

		return baseCharacter;
	}

	watchSelectedItem() {
		this.setupViewport();

		return clientStore.subscribe(selectCustomizationPage, (page) => {
			if (page === "character") {
				this.setupViewport();
			}
		});
	}

	watchAdditionalItem() {
		return clientStore.subscribe(selectCharacterOptions, (options, oldOptions) => {
			this.updateViewportCharacter(options);
		});
	}

	watchDragging() {
		return UserInputService.InputChanged.Connect((input, gpe) => {
			if (gpe || !this.dragging) {
				return;
			}
		});
	}

	updateViewportCharacter(options: CharacterOptions) {
		const baseCharacter = clientStore.getState(selectCharacterCustomizationModel);
		const character = this.updateCharacter(options);
		if (!baseCharacter) {
			clientStore.setCharacterCustomizationModel(character);
			this.modelCharacter = character;
		}
	}

	setupViewport(options: CharacterOptions = clientStore.getState(selectCharacterOptions)) {
		this.updateViewportCharacter(options);
	}

	cleanPreview() {
		clientStore.setCharacterCustomizationModel(undefined);
		this.modelCharacter?.Destroy();
	}

	onRender(dt: number) {
		if (!this.dragging || !this.modelCharacter) {
			return;
		}
	}
}
