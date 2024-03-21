import { useSelector } from "@rbxts/react-reflex";
import Roact from "@rbxts/roact";
import { RunService } from "@rbxts/services";
import { selectCustomizationIsOpen } from "client/store/customization";
import { Customization } from "./customization";
import { WeaponCustomization } from "./weapon/weapon-customization";

const DEBUG = !RunService.IsRunning();

export function CustomizationProvider() {
	const isCustomizingWeapon = true; //useSelector(selectIsCustomizingWeapon);
	const customizationOpen = DEBUG || useSelector(selectCustomizationIsOpen);

	return (
		<>
			{customizationOpen && (
				<>
					{isCustomizingWeapon ? (
						<WeaponCustomization key={"weapon-customization-layer"} />
					) : (
						<Customization key={"customization-layer"} />
					)}
				</>
			)}
		</>
	);
}
