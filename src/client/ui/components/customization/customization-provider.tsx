import { useSelector } from "@rbxts/react-reflex";
import Roact from "@rbxts/roact";
import { selectCustomizationIsOpen, selectCustomizationPage } from "client/store/customization";
import { CharacterCustomization } from "./character/character-customization";
import { WeaponCustomization } from "./weapon/weapon-customization";

export function CustomizationProvider() {
	const customizationOpen = useSelector(selectCustomizationIsOpen);
	const customizationPage = useSelector(selectCustomizationPage);

	return (
		<>
			{customizationOpen && (
				<>
					{customizationPage === "character" && <CharacterCustomization />}
					{customizationPage === "weapon" && <WeaponCustomization />}
				</>
			)}
		</>
	);
}
