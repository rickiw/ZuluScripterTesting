import Roact from "@rbxts/roact";
import { useRem } from "client/ui/hooks";
import { Frame } from "client/ui/library/frame";
import { Image } from "client/ui/library/image";
import { Text } from "client/ui/library/text";
import { images } from "shared/assets/images";
import { fonts } from "shared/constants/fonts";
import { CustomizationButtonRow } from "./button-row";
import { CustomizationPageProvider } from "./customization-page-provider";

export function CharacterCustomization() {
	const rem = useRem();

	return (
		<>
			<Frame size={new UDim2(0, rem(45), 1, 0)} backgroundColor={Color3.fromRGB(16, 20, 21)}>
				<Image
					size={UDim2.fromOffset(rem(5), rem(5))}
					position={UDim2.fromOffset(rem(1), rem(4))}
					image={images.ui.icons.customize}
				/>
				<Text
					text="CHARACTER CUSTOMIZATION"
					position={UDim2.fromOffset(rem(5.5), rem(4))}
					size={UDim2.fromOffset(rem(37.5), rem(5))}
					textColor={Color3.fromRGB(255, 255, 255)}
					textSize={rem(2.75)}
					backgroundTransparency={1}
					textWrapped={true}
					textXAlignment="Center"
					textYAlignment="Center"
					font={fonts.inter.medium}
				/>
				<Image
					size={UDim2.fromOffset(rem(45), rem(0.25))}
					position={UDim2.fromOffset(rem(0), rem(10))}
					image={images.ui.misc.divider}
				/>

				<CustomizationButtonRow />

				<CustomizationPageProvider />

				<Image
					size={UDim2.fromOffset(rem(45), rem(0.25))}
					position={new UDim2(0, rem(0), 1, -rem(7.5))}
					image={images.ui.misc.divider}
				/>
			</Frame>
		</>
	);
}
