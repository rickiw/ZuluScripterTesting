import { useSelector } from "@rbxts/react-reflex";
import Roact from "@rbxts/roact";
import { RunService } from "@rbxts/services";
import { selectCustomizationIsOpen, selectIsCustomizingWeapon } from "client/store/customization";
import { CharacterCustomization } from "./character/character-customization";
import { WeaponCustomization } from "./weapon/weapon-customization";

const DEBUG = !RunService.IsRunning();

export function CustomizationProvider() {
	const isCustomizingWeapon = useSelector(selectIsCustomizingWeapon);
	const customizationOpen = DEBUG || useSelector(selectCustomizationIsOpen);

	return (
		<>
			{customizationOpen && (
				<>
					{isCustomizingWeapon ? (
						<WeaponCustomization key={"weapon-customization-layer"} />
					) : (
						<CharacterCustomization key={"customization-layer"} />
					)}
				</>
			)}
		</>
	);
}
