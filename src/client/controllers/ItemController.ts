/**
 * @author </Nexus_Prime>
 * @description In case needed help to understand, go to https://nexusprime.vercel.app
 */
/* eslint-disable no-void */

import { Controller, OnStart } from "@flamework/core";
import { Players } from "@rbxts/services";
import { Events } from "client/network";
import notifications from "client/store/notifications";

enum ActionType {
	On,
	Off,
}

const player = Players.LocalPlayer;

type _ = keyof Omit<ItemController, "onStart">;
const cache = new Map<string, () => any>();

@Controller()
export class ItemController implements OnStart {
	IdCard(action: ActionType, child: Instance) {
		Events.ItemAction.fire({ target: player, action, name: child.Name });
	}

	Defibulator(action: ActionType, child: Instance) {
		if (action === ActionType.Off) {
			cache.get("Defibulator")?.();

			return;
		}

		const mouse = player.GetMouse();

		const mouseBtnEvent = mouse.Button1Down.Connect(() => {
			const targetCharacter = mouse.Target?.Parent;
			const targetPlayer = Players.GetPlayerFromCharacter(targetCharacter);

			if (!targetPlayer) {
				notifications.add({
					title: "Can't use Defibulator",
					content: "The selected object isn't a player",
				});

				return;
			}

			if (targetPlayer?.GetAttribute("Reanimated") === true) {
				notifications.add({
					title: "Can't use Defibulator",
					content: "This player has already been reanimated",
				});

				return;
			}

			const playerPosition = targetCharacter!.FindFirstChild<Part>("HumanoidRootPart")?.Position;
			const targetPosition = targetCharacter!.FindFirstChild<Part>("HumanoidRootPart")?.Position;

			if (playerPosition || targetPosition) {
				const distance = playerPosition!.sub(targetPosition!).Magnitude;

				if (distance < 6) {
					targetPlayer && Events.ItemAction.fire({ target: targetPlayer, name: child.Name });
				} else {
					notifications.add({
						title: "Can't use Defibulator",
						content: "You're too far away!",
					});
				}
			}
		});

		cache.set("Defibulator", () => void mouseBtnEvent.Disconnect());
	}

	Medkit(action: ActionType, child: Instance) {
		if (action === ActionType.Off) {
			cache.get("Medkit")?.();

			return;
		}

		const character = player.Character!;

		const mouse = player.GetMouse();

		const mouseBtnEvent = mouse.Button1Down.Connect(() => {
			const characterTarget = mouse.Target?.Parent;
			const playerTarget = Players.GetPlayerFromCharacter(characterTarget);

			const playerPosition = character!.FindFirstChild<Part>("HumanoidRootPart")?.Position;
			const targetPosition = characterTarget?.FindFirstChild<Part>("HumanoidRootPart")?.Position;

			if (playerPosition || targetPosition) {
				const distance = playerPosition!.sub(targetPosition!).Magnitude;

				if (distance < 6) {
					if (playerTarget) {
						const humanoid = playerTarget.FindFirstChildOfClass("Humanoid")!;

						humanoid.Health += 100;
					}
				} else {
					notifications.add({
						title: "Can't use Medkit",
						content: "You're too far away!",
					});
				}
			}
		});

		cache.set("Medkit", () => void mouseBtnEvent.Disconnect());
	}

	AFAK(action: ActionType, child: Instance) {
		if (action === ActionType.Off) {
			cache.get(child.Name)?.();

			return;
		}

		const mouse = player.GetMouse();
		const character = player.Character!;
		const characterRoot = character.FindFirstChild<Part>("HumanoidRootPart")!;

		const playerPos = characterRoot.Position;
		const playerLookDirection = characterRoot.CFrame.LookVector;
		const itemCFrame = new CFrame(playerPos.add(playerLookDirection.mul(5)));

		const mouseBtnEvent = mouse.Button1Down.Once(() => {
			Events.ItemAction.fire({ name: child.Name, CFrame: itemCFrame });
		});

		cache.set(child.Name, () => {
			mouseBtnEvent.Disconnect();
		});
	}

	FAK(action: ActionType, child: Instance) {
		if (action === ActionType.Off) {
			cache.get(child.Name)?.();

			return;
		}

		const mouse = player.GetMouse();
		const character = player.Character!;
		const characterRoot = character.FindFirstChild<Part>("HumanoidRootPart")!;

		const playerPos = characterRoot.Position;
		const playerLookDirection = characterRoot.CFrame.LookVector;
		const itemCFrame = new CFrame(playerPos.add(playerLookDirection.mul(5)));

		const mouseBtnEvent = mouse.Button1Down.Once(() => {
			Events.ItemAction.fire({ name: child.Name, CFrame: itemCFrame });
		});

		cache.set(child.Name, () => {
			mouseBtnEvent.Disconnect();
		});
	}

	onStart() {
		const character = player.Character ?? player.CharacterAdded.Wait()[0];
		if (character.FindFirstChildOfClass("Humanoid")!.GetState() === Enum.HumanoidStateType.Dead) {
			return;
		}

		character.ChildAdded.Connect((c) => this[c.Name as _]?.(ActionType.On, c));
		character.ChildRemoved.Connect((c) => this[c.Name as _]?.(ActionType.Off, c));
	}
}
