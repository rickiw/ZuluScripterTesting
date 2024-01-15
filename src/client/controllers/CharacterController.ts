import { Controller, OnStart, OnTick } from "@flamework/core";
import Maid from "@rbxts/maid";
import { Players, UserInputService } from "@rbxts/services";
import { setInterval, setTimeout } from "@rbxts/set-timeout";
import { Events } from "client/network";
import { clientStore } from "client/store";
import { selectExhausted, selectRecovering, selectSprinting } from "client/store/character";
import { selectMenuOpen } from "client/store/menu";
import {
	DEPLETE_PER_SECOND,
	RECOVER_PER_SECOND,
	SPEED_CROUCH,
	SPEED_SPRINT,
	SPEED_TIRED,
	SPEED_WALK,
} from "shared/constants/character";
import { damp, lerp } from "shared/utils";
import { HandlesInput } from "./BaseInput";

const player = Players.LocalPlayer;

@Controller()
export class CharacterController extends HandlesInput implements OnStart, OnTick {
	maid = new Maid();
	inputs = new ReadonlySet([Enum.KeyCode.LeftShift, Enum.KeyCode.ButtonL3]);

	onStart() {
		this.maid.GiveTask(
			UserInputService.InputBegan.Connect((input, processed) => {
				if (!processed && this.hasInput(input.KeyCode)) {
					clientStore.setSprinting(true);
				}
			}),
		);
		this.maid.GiveTask(
			UserInputService.InputEnded.Connect((input) => {
				if (this.hasInput(input.KeyCode)) {
					clientStore.setSprinting(false);
				}
			}),
		);
		this.maid.GiveTask(
			Events.StaminaBoostChanged.connect((staminaBoost) => clientStore.setStaminaBoost(staminaBoost)),
		);

		this.startStaminaLoop();
	}

	getHumanoid() {
		const character = player.Character || player.CharacterAdded.Wait()[0];
		return character.FindFirstChildWhichIsA("Humanoid")!;
	}

	isMoving() {
		return this.getHumanoid().MoveDirection !== Vector3.zero;
	}

	startStaminaLoop() {
		let nextRecovery = 0;

		clientStore.observeWhile(selectSprinting, () => {
			if (this.isMoving()) {
				clientStore.incrementStamina(-DEPLETE_PER_SECOND * 0.1);
			}

			return setInterval(() => {
				nextRecovery = time() + 0.5;

				if (this.isMoving()) {
					clientStore.incrementStamina(-DEPLETE_PER_SECOND * 0.1);
				}
			}, 0.1);
		});

		clientStore.observeWhile(selectExhausted, () => {
			return setTimeout(() => {
				clientStore.incrementStamina(RECOVER_PER_SECOND * 0.1);
			}, 3);
		});

		clientStore.observeWhile(selectRecovering, () => {
			return setInterval(() => {
				if (time() < nextRecovery) return;
				clientStore.incrementStamina(RECOVER_PER_SECOND * 0.1);
			}, 0.1);
		});
	}

	getSpeedOffset() {
		const humanoid = this.getHumanoid();
		if (!humanoid) return 0;
		const offset = humanoid.GetAttribute("SpeedOffset");
		return typeIs(offset, "number") ? offset : 0;
	}

	onTick(dt: number) {
		const humanoid = this.getHumanoid();
		const offset = this.getSpeedOffset();

		if (!humanoid) return;

		const sprinting = clientStore.getState(selectSprinting);
		const inMenu = clientStore.getState(selectMenuOpen);

		if (inMenu) {
			humanoid.WalkSpeed = 0;
			return;
		}

		if (offset <= SPEED_CROUCH - SPEED_WALK && sprinting) {
			clientStore.setSprinting(false);
		}

		humanoid.WalkSpeed = lerp(humanoid.WalkSpeed, this.getSpeed() + offset, damp(2, dt));
	}

	getSpeed() {
		const sprinting = clientStore.getState(selectSprinting);
		const exhausted = clientStore.getState(selectExhausted);
		const inMenu = clientStore.getState(selectMenuOpen);

		switch (true) {
			case sprinting && !exhausted:
				return SPEED_SPRINT;
			case exhausted:
				return SPEED_TIRED;
			case inMenu:
				return 0;
			default:
				return SPEED_WALK;
		}
	}
}
