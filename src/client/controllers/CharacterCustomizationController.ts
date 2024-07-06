import { Controller, OnRender, OnStart } from "@flamework/core";
import { New } from "@rbxts/fusion";
import Log from "@rbxts/log";
import Maid from "@rbxts/maid";
import { CharacterRigR15 } from "@rbxts/promise-character";
import { Players, UserInputService, Workspace } from "@rbxts/services";
import { Events, Functions } from "client/network";
import { clientStore } from "client/store";
import { selectCharacterOptions, selectCustomizationPage } from "client/store/customization";
import { selectPlayerSave } from "client/store/menu";
import { CharacterOptions } from "shared/constants/character";
import { setCharacterProperties } from "shared/utils";

const player = Players.LocalPlayer;
const mouse = player.GetMouse();

@Controller()
export class CharacterCustomizationController implements OnStart, OnRender {
	modelCharacter?: CharacterRigR15;
	lastMousePosition?: Vector2;

	maid = new Maid();
	moved = Vector2.zero;
	dragging = false;

	onStart() {
		clientStore.subscribe(selectPlayerSave, (playerData, oldPlayerData) => {
			if (!playerData || oldPlayerData !== undefined) {
				return;
			}
			clientStore.setCharacterOptions({
				...playerData.characterOptions,
				skinColor: Color3.fromHex(playerData.characterOptions.skinColor),
			});
		});
	}

	private setCharacterProperties(character: CharacterRigR15, options: CharacterOptions) {
		setCharacterProperties(character, options);
		Events.SetAccessories(character, options.hair);
	}

	updateCharacter(options: CharacterOptions) {
		const character = this.modelCharacter;
		if (!character) {
			Log.Warn("No character to update");
			return;
		}

		this.setCharacterProperties(character, options);
		return character;
	}

	getCharacterPosition() {
		return new CFrame(
			Workspace.CustomizationBox.Mount.Position.add(Workspace.CustomizationBox.Mount.CFrame.LookVector.mul(7.5)),
		).add(new Vector3(0, -3, 0));
	}

	startDragListener() {
		this.maid.GiveTask(
			UserInputService.InputBegan.Connect((input, gpe) => {
				if (gpe) {
					return;
				}

				if (input.UserInputType === Enum.UserInputType.MouseButton2) {
					this.dragging = true;
					this.lastMousePosition = UserInputService.GetMouseLocation();
				}
			}),
		);

		this.maid.GiveTask(
			UserInputService.InputEnded.Connect((input, gpe) => {
				if (gpe) {
					return;
				}

				if (input.UserInputType === Enum.UserInputType.MouseButton2) {
					this.dragging = false;
				}
			}),
		);
	}

	buildCharacter(options: CharacterOptions) {
		const [success, baseCharacter] = Functions.GetCustomizationCharacter.invoke().await();
		if (!success) {
			Log.Warn("Failed to get customization character");
			return;
		}
		baseCharacter.Parent = Workspace.CustomizationBox.Assets;
		const animator = baseCharacter.Humanoid.FindFirstChildOfClass("Animator")!;

		const animation = New("Animation")({
			AnimationId: "rbxassetid://507766388",
		});

		const animationTrack = animator.LoadAnimation(animation);
		animationTrack.Looped = true;
		animationTrack.Play();

		baseCharacter.PivotTo(this.getCharacterPosition());
		this.setCharacterProperties(baseCharacter, options);
		this.startDragListener();

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
		if (!this.modelCharacter || !this.modelCharacter.IsDescendantOf(game)) {
			this.modelCharacter = this.buildCharacter(options);
		} else {
			this.updateCharacter(options);
		}
	}

	setupViewport(options: CharacterOptions = clientStore.getState(selectCharacterOptions)) {
		this.updateViewportCharacter(options);
	}

	cleanPreview() {
		this.maid.DoCleaning();
		this.modelCharacter?.Destroy();
	}

	onRender(dt: number) {
		if (!this.dragging || !this.modelCharacter) {
			return;
		}

		const currentMousePosition = UserInputService.GetMouseLocation();
		const delta = currentMousePosition.sub(this.lastMousePosition!);
		const sensitivity = new Vector3(0.01, 0.01, 0.01);

		const rotationDelta = new Vector3(0, delta.X * sensitivity.Y, 0);

		this.modelCharacter.PivotTo(
			this.modelCharacter
				.GetPivot()
				.Lerp(this.modelCharacter.GetPivot().mul(CFrame.Angles(0, rotationDelta.Y, 0)), 0.5),
		);

		this.lastMousePosition = currentMousePosition;
	}
}
