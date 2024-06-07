import { Controller, OnStart } from "@flamework/core";
import Log from "@rbxts/log";
import { CharacterRigR15 } from "@rbxts/promise-character";
import { Players, UserInputService } from "@rbxts/services";
import { Events } from "client/network";
import { clientStore } from "client/store";
import { selectEquippedWeaponInfo } from "client/store/inventory";
import { selectLoadedWeapon } from "client/store/weapon";
import { playSound } from "shared/utils/sounds";

const player = Players.LocalPlayer!;
const character = (player.Character || player.CharacterAdded.Wait()[0]) as CharacterRigR15;

@Controller()
export class FirearmController implements OnStart {
	onStart() {
		Events.PlayHitmarker.connect(() => this.playHitmarker());
		Events.EnemyKilled.connect(() => clientStore.setHasKilledEnemy(true));

		UserInputService.InputBegan.Connect((input) => {
			if (input.KeyCode === Enum.KeyCode.Home) {
				Events.Help.fire();
			}
		});

		Events.SetWeaponInfo.connect((weaponName, ammo, reserve, override) => {
			const loadedWeapon = clientStore.getState(selectLoadedWeapon);
			if (!loadedWeapon) {
				Log.Warn("No loaded weapon | BaseFirearm->SetWeaponInfo");
				return;
			}

			const equippedWeaponInfo = clientStore.getState(selectEquippedWeaponInfo);
			if (loadedWeapon.instance.Name !== weaponName || (!override && !equippedWeaponInfo)) {
				Log.Warn("Weapon name does not match or override is false, returning | BaseFirearm->SetWeaponInfo");
				return;
			}
			clientStore.setEquippedWeaponInfo({
				weaponName,
				ammo,
				reserve,
			});
		});
	}

	playHitmarker() {
		playSound("rbxassetid://160432334", { volume: 1.5, lifetime: 1 });
	}
}
