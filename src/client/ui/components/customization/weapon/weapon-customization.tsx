import Roact from "@rbxts/roact";
import { WeaponCustomizationPageProvider } from "client/ui/components/customization/weapon/weapon-customization-page-provider";
import { useRem } from "client/ui/hooks";
import { Frame } from "client/ui/library/frame";
import { Image } from "client/ui/library/image";
import { Text } from "client/ui/library/text";
import { images } from "shared/assets/images";
import { fonts } from "shared/constants/fonts";
import { palette } from "shared/constants/palette";
import { WeaponCustomizationFooter } from "./weapon-customization-footer";
import { WeaponCustomizationRow } from "./weapon-customization-row";

export function WeaponCustomization() {
	const rem = useRem();

	return (
		<>
			<Frame size={new UDim2(0, rem(36), 1, 0)} backgroundColor={palette.base}>
				<Image
					size={UDim2.fromOffset(rem(3), rem(3))}
					position={UDim2.fromOffset(rem(2), rem(1))}
					image={images.ui.icons.weapon_customize}
				/>
				<Text
					text="WEAPON CUSTOMIZATION"
					position={UDim2.fromOffset(rem(7), rem(2.5))}
					textAutoResize="XY"
					textColor={palette.white}
					textSize={rem(2)}
					anchorPoint={new Vector2(0, 0.5)}
					backgroundTransparency={1}
					textWrapped={false}
					textXAlignment="Left"
					textYAlignment="Center"
					font={fonts.arimo.regular}
				/>
				<Image
					size={new UDim2(1, 0, 0, rem(0.2))}
					anchorPoint={new Vector2(0, 0.5)}
					position={UDim2.fromOffset(rem(0), rem(5))}
					image={images.ui.misc.divider}
				/>

				<WeaponCustomizationRow />
				<WeaponCustomizationPageProvider />
				<WeaponCustomizationFooter />
			</Frame>
		</>
	);
}
