import Roact from "@rbxts/roact";
import { CharacterCustomizationPageProvider } from "client/ui/components/customization/character/character-customization-page-provider";
import { useRem } from "client/ui/hooks";
import { Frame } from "client/ui/library/frame";
import { Image } from "client/ui/library/image";
import { Text } from "client/ui/library/text";
import { images } from "shared/assets/images";
import { fonts } from "shared/constants/fonts";
import { palette } from "shared/constants/palette";
import { CharacterCustomizationFooter } from "./character-customization-footer";
import { CharacterCustomizationRow } from "./character-customization-row";

export function CharacterCustomization() {
	const rem = useRem();

	return (
		<>
			<Frame size={new UDim2(0, rem(36), 1, 0)} backgroundColor={palette.base}>
				<Image
					size={UDim2.fromOffset(rem(3), rem(3))}
					position={UDim2.fromOffset(rem(2), rem(3.5))}
					image={images.ui.icons.customize}
				/>
				<Text
					text="CHARACTER CUSTOMIZATION"
					position={UDim2.fromOffset(rem(7), rem(5))}
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
					position={UDim2.fromOffset(rem(0), rem(7.5))}
					image={images.ui.misc.divider}
				/>

				<CharacterCustomizationRow />
				<CharacterCustomizationPageProvider />
				<CharacterCustomizationFooter />
			</Frame>
		</>
	);
}
