import { useSelector } from "@rbxts/react-reflex";
import Roact, { useEffect } from "@rbxts/roact";
import { clientStore } from "client/store";
import { selectCustomizationIsOpen, selectWeaponCustomizationPage } from "client/store/customization";
import { selectPrimaryWeapon, selectSecondaryWeapon, selectWeapons } from "client/store/inventory";
import { useRem } from "client/ui/hooks";
import { Frame } from "client/ui/library/frame";
import { WeaponButtonRowButton } from "./weapon-button-row-button";

export function WeaponCustomizationRow() {
	const rem = useRem();

	const isCustomizationOpen = useSelector(selectCustomizationIsOpen);
	const weaponPage = useSelector(selectWeaponCustomizationPage);

	const allWeapons = useSelector(selectWeapons);
	const primaryWeapon = useSelector(selectPrimaryWeapon);
	const secondaryWeapon = useSelector(selectSecondaryWeapon);

	useEffect(() => {
		if (!primaryWeapon && weaponPage === "primary") {
			clientStore.setSelectedWeapon(undefined);
		} else if (!secondaryWeapon && weaponPage === "secondary") {
			clientStore.setSelectedWeapon(undefined);
		}

		if (primaryWeapon && weaponPage === "primary") {
			const matchingWeapon = allWeapons.find(
				(weapon) => weapon.baseTool.Name === primaryWeapon.Name && weapon.weaponType === "Primary",
			);
			clientStore.setSelectedWeapon(matchingWeapon);
		} else if (secondaryWeapon && weaponPage === "secondary") {
			const matchingWeapon = allWeapons.find(
				(weapon) => weapon.baseTool.Name === secondaryWeapon.Name && weapon.weaponType === "Secondary",
			);
			clientStore.setSelectedWeapon(matchingWeapon);
		}
	}, [weaponPage]);

	useEffect(() => {
		clientStore.setWeaponCustomizationPage("primary");
	}, [isCustomizationOpen]);

	return (
		<>
			<Frame
				position={UDim2.fromOffset(rem(0), rem(10.25))}
				size={UDim2.fromOffset(rem(45), rem(4.75))}
				backgroundTransparency={1}
				zIndex={2}
			>
				<uigridlayout
					CellPadding={UDim2.fromOffset(rem(1), rem(1))}
					CellSize={UDim2.fromOffset(rem(6), rem(5))}
				/>
				<WeaponButtonRowButton title="PRIMARY 01" page="primary" icon="rifle" selectedIcon="rifleselected" />
				<WeaponButtonRowButton
					title="SECONDARY 02"
					page="secondary"
					icon="handgun"
					selectedIcon="handgunselected"
				/>
				<WeaponButtonRowButton title="MELEE 03" page="melee" icon="knife" selectedIcon="knifeselected" />
				<WeaponButtonRowButton
					title="MODS 04"
					page="attachments"
					icon="attachments"
					selectedIcon="attachmentsselected"
				/>
			</Frame>
			<Frame
				zIndex={1}
				backgroundColor={Color3.fromRGB(33, 38, 41)}
				size={UDim2.fromOffset(rem(45), rem(2))}
				position={UDim2.fromOffset(rem(0), rem(15.25))}
			/>
		</>
	);
}
