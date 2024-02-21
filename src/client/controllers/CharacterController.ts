import { Controller, OnStart, OnTick } from "@flamework/core";
import { CharacterRigR15 } from "@rbxts/promise-character";
import { Players, UserInputService } from "@rbxts/services";
import { setInterval, setTimeout } from "@rbxts/set-timeout";
import { Events } from "client/network";
import { clientStore } from "client/store";
import { selectExhausted, selectRecovering, selectSprinting } from "client/store/character";
import { selectMenuOpen } from "client/store/menu";
import { selectHealth, selectHunger, selectThirst } from "client/store/vitals";
import {
	HUNGER_DEPLETE_PER_SECOND,
	HUNGER_RECOVER_PER_SECOND,
	SPEED_CROUCH,
	SPEED_SPRINT,
	SPEED_TIRED,
	SPEED_WALK,
	STAMINA_DEPLETE_PER_SECOND,
	STAMINA_RECOVER_PER_SECOND,
	THIRST_DEPLETE_PER_SECOND,
	THIRST_RECOVER_PER_SECOND,
	UNSATIATED_DAMAGE_PER_SECOND,
} from "shared/constants/character";
import { damp, lerp } from "shared/utils";
import { HandlesInput } from "./BaseInput";

const player = Players.LocalPlayer;
const character = (player.Character || player.CharacterAdded.Wait()[0]) as CharacterRigR15;

@Controller()
export class CharacterController extends HandlesInput implements OnStart, OnTick {
	inputs = [Enum.KeyCode.LeftShift, Enum.KeyCode.ButtonL3];

	onStart() {
		UserInputService.InputBegan.Connect((input, processed) => {
			if (!processed && this.hasInput(input.KeyCode)) {
				clientStore.setSprinting(true);
			}
		});

		UserInputService.InputEnded.Connect((input) => {
			if (this.hasInput(input.KeyCode)) {
				clientStore.setSprinting(false);
			}
		});

		Events.StaminaBoostChanged.connect((staminaBoost) => clientStore.setStaminaBoost(staminaBoost));

		this.startVitalsLoop();
		this.startStaminaLoop();

		character.Humanoid.HealthChanged.Connect((health) => {
			clientStore.setHealth(health);
		});
		clientStore.subscribe(selectHealth, (maxHealth) => {
			character.Humanoid.MaxHealth = maxHealth.max;
		});
	}

	getHumanoid() {
		const character = player.Character || player.CharacterAdded.Wait()[0];
		return character.FindFirstChildWhichIsA("Humanoid")!;
	}

	isMoving() {
		return this.getHumanoid().MoveDirection !== Vector3.zero;
	}

	startVitalsLoop() {
		let nextRecovery = 0;

		setInterval(() => {
			if (this.isMoving()) {
				nextRecovery = time() + 5;
			}

			if (this.isMoving() && clientStore.getState(selectSprinting)) {
				clientStore.incrementHunger(-HUNGER_DEPLETE_PER_SECOND * 0.1);
				clientStore.incrementThirst(-THIRST_DEPLETE_PER_SECOND * 0.1);
			}
		}, 0.1);

		setInterval(() => {
			if (time() < nextRecovery) return;
			clientStore.incrementHunger(HUNGER_RECOVER_PER_SECOND);
			clientStore.incrementThirst(THIRST_RECOVER_PER_SECOND);
		}, 1);

		setInterval(() => {
			if (clientStore.getState(selectHunger).value <= 0 || clientStore.getState(selectThirst).value <= 0) {
				character.Humanoid.TakeDamage(UNSATIATED_DAMAGE_PER_SECOND);
			}
		}, 2);
	}

	startStaminaLoop() {
		let nextRecovery = 0;

		clientStore.observeWhile(selectSprinting, () => {
			if (this.isMoving()) {
				clientStore.incrementStamina(-STAMINA_DEPLETE_PER_SECOND * 0.1);
			}

			return setInterval(() => {
				nextRecovery = time() + 0.5;

				if (this.isMoving()) {
					clientStore.incrementStamina(-STAMINA_DEPLETE_PER_SECOND * 0.1);
				}
			}, 0.1);
		});

		clientStore.observeWhile(selectExhausted, () => {
			return setTimeout(() => {
				clientStore.incrementStamina(STAMINA_RECOVER_PER_SECOND * 0.1);
			}, 3);
		});

		clientStore.observeWhile(selectRecovering, () => {
			return setInterval(() => {
				if (time() < nextRecovery) return;
				clientStore.incrementStamina(STAMINA_RECOVER_PER_SECOND * 0.1);
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

		humanoid.WalkSpeed =
			humanoid.WalkSpeed === 0 ? 0 : lerp(humanoid.WalkSpeed, this.getSpeed() + offset, damp(2, dt));
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
