import { useSelector } from "@rbxts/react-reflex";
import Roact, { useEffect } from "@rbxts/roact";
import { clientStore } from "client/store";
import {
	selectCustomizationIsOpen,
	selectWeaponCustomizationPage,
	selectWeaponCustomizationPageIndex,
} from "client/store/customization";
import { selectPrimaryWeapon, selectSecondaryWeapon, selectWeapons } from "client/store/inventory";
import { useRem } from "client/ui/hooks";
import { images } from "shared/assets/images";
import { SCPTab, SCPTabs } from "../../scp";

export function WeaponCustomizationRow() {
	const rem = useRem();

	const isCustomizationOpen = useSelector(selectCustomizationIsOpen);
	const selectedPage = useSelector(selectWeaponCustomizationPage);
	const selectedIndex = useSelector(selectWeaponCustomizationPageIndex);

	const allWeapons = useSelector(selectWeapons);
	const primaryWeapon = useSelector(selectPrimaryWeapon);
	const secondaryWeapon = useSelector(selectSecondaryWeapon);

	useEffect(() => {
		if (!primaryWeapon && selectedPage === "primary") {
			clientStore.setSelectedWeapon(undefined);
		} else if (!secondaryWeapon && selectedPage === "secondary") {
			clientStore.setSelectedWeapon(undefined);
		}

		if (primaryWeapon && selectedPage === "primary") {
			const matchingWeapon = allWeapons.find(
				(weapon) => weapon.baseTool.Name === primaryWeapon.Name && weapon.weaponType === "Primary",
			);
			clientStore.setSelectedWeapon(matchingWeapon);
		} else if (secondaryWeapon && selectedPage === "secondary") {
			const matchingWeapon = allWeapons.find(
				(weapon) => weapon.baseTool.Name === secondaryWeapon.Name && weapon.weaponType === "Secondary",
			);
			clientStore.setSelectedWeapon(matchingWeapon);
		}
	}, [selectedPage]);

	useEffect(() => {
		clientStore.setWeaponCustomizationPage("primary");
	}, [isCustomizationOpen]);

	return (
		<SCPTabs
			size={new UDim2(1, 0, 0, rem(4.5))}
			position={UDim2.fromOffset(rem(0), rem(5))}
			selectedPage={selectedPage}
			selectedIndex={selectedIndex}
			fat
		>
			<SCPTab
				page="PRIMARY"
				index={1}
				rectSize={new Vector2(128, 128)}
				rectOffset={new Vector2(128, 128)}
				selectedPage={selectedPage.upper()}
				onClick={() => {
					clientStore.setWeaponCustomizationPage("primary");
				}}
				icon={images.ui.icons.weapon_customization_icons}
			/>
			<SCPTab
				page="SECONDARY"
				index={2}
				rectSize={new Vector2(128, 128)}
				rectOffset={new Vector2(128, 0)}
				selectedPage={selectedPage.upper()}
				onClick={() => {
					clientStore.setWeaponCustomizationPage("secondary");
				}}
				icon={images.ui.icons.weapon_customization_icons}
			/>
			<SCPTab
				page="MELEE"
				index={3}
				rectSize={new Vector2(128, 128)}
				rectOffset={new Vector2(0, 128)}
				selectedPage={selectedPage.upper()}
				onClick={() => {
					clientStore.setWeaponCustomizationPage("melee");
				}}
				icon={images.ui.icons.weapon_customization_icons}
			/>
			<SCPTab
				page="MODS"
				index={4}
				rectSize={new Vector2(128, 128)}
				rectOffset={new Vector2(0, 0)}
				selectedPage={selectedPage.upper()}
				onClick={() => {
					clientStore.setWeaponCustomizationPage("mods");
				}}
				icon={images.ui.icons.weapon_customization_icons}
			/>
		</SCPTabs>
	);
}
