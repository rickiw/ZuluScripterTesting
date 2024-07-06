import { useSelector } from "@rbxts/react-reflex";
import Roact, { useEffect } from "@rbxts/roact";
import { selectCustomizationIsOpen, selectCustomizationPage } from "client/store/customization";
import { useMotion, useRem } from "client/ui/hooks";
import { Frame } from "client/ui/library/frame";
import { palette } from "shared/constants/palette";
import { CharacterCustomization } from "./character/character-customization";
import { WeaponCustomization } from "./weapon/weapon-customization";

export function CustomizationProvider() {
	const rem = useRem();

	const customizationOpen = useSelector(selectCustomizationIsOpen);
	const customizationPage = useSelector(selectCustomizationPage);

	const [fade, fadeMotion] = useMotion(1);

	useEffect(() => {
		fadeMotion.set(0);
		fadeMotion.tween(1, { time: 0.3, style: Enum.EasingStyle.Quint });
	}, [customizationPage]);

	return (
		<>
			{customizationOpen && (
				<>
					<Frame
						size={new UDim2(0, rem(36), 1, 0)}
						zIndex={5}
						backgroundColor={palette.base}
						backgroundTransparency={fade}
					/>
					{customizationPage === "character" && <CharacterCustomization />}
					{customizationPage === "weapon" && <WeaponCustomization />}
				</>
			)}
		</>
	);
}
