import { useSelector } from "@rbxts/react-reflex";
import Roact from "@rbxts/roact";
import { clientStore } from "client/store";
import { selectCustomizationPage } from "client/store/customization";
import { useRem } from "client/ui/hooks";
import { Button } from "client/ui/library/button/button";
import { Image } from "client/ui/library/image";
import { images } from "shared/assets/images";
import { fonts } from "shared/constants/fonts";

export function CustomizationActionButton() {
	const rem = useRem();

	const customizationPage = useSelector(selectCustomizationPage);

	return (
		<>
			<Button
				size={UDim2.fromOffset(rem(12.5), rem(4))}
				position={new UDim2(0, rem(50), 1, -rem(5))}
				backgroundColor={Color3.fromRGB(16, 20, 21)}
				text="NEXT"
				textXAlignment="Left"
				textColor={Color3.fromRGB(255, 255, 255)}
				font={fonts.inter.medium}
				textSize={rem(1.75)}
				event={{
					MouseButton1Click: () => {
						clientStore.setCustomizationPage(customizationPage === "character" ? "weapon" : "character");
					},
				}}
			>
				<uicorner CornerRadius={new UDim(0, rem(1))} />
				<uipadding PaddingLeft={new UDim(0, rem(2.5))} />
				<Image
					image={images.ui.icons.arrowright}
					size={UDim2.fromOffset(rem(1.25), rem(1.5))}
					anchorPoint={new Vector2(0.5, 0.5)}
					position={UDim2.fromScale(0.8, 0.5)}
				/>
			</Button>
		</>
	);
}
