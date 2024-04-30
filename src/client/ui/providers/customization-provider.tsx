import { useSelector } from "@rbxts/react-reflex";
import Roact from "@rbxts/roact";
import { selectCustomizationIsOpen, selectIsCustomizingWeapon } from "client/store/customization";
import { CharacterCustomization } from "../components/customization/character/character-customization";
import { WeaponCustomization } from "../components/customization/weapon/weapon-customization";

export function CustomizationProvider() {
	const isCustomizingWeapon = useSelector(selectIsCustomizingWeapon);
	const customizationOpen = useSelector(selectCustomizationIsOpen);

	return (
		<>
			{customizationOpen && (
				<>
					{isCustomizingWeapon ? (
						<WeaponCustomization key={"weapon-customization-layer"} />
					) : (
						<CharacterCustomization key={"character-customization-layer"} />
					)}
				</>
			)}
		</>
	);
}
