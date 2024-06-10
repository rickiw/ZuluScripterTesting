import { useSelector } from "@rbxts/react-reflex";
import Roact, { useEffect } from "@rbxts/roact";
import { clientStore } from "client/store";
import { selectCookingIsOpen } from "client/store/cooking";
import { images } from "shared/assets/images";
import { fonts } from "shared/constants/fonts";
import { springs } from "shared/constants/springs";
import { useMotion, useRem } from "../../hooks";
import { Image } from "../../library/image";
import { Text } from "../../library/text";
import { SCPClock, SCPWindow } from "../scp";
import { FoodSelection } from "./food-selection";

export function CookingProvider() {
	const rem = useRem();
	const isCooking = useSelector(selectCookingIsOpen);
	const [backgroundTransparency, backgroundTransparencyMotion] = useMotion(1);

	useEffect(() => {
		backgroundTransparencyMotion.spring(isCooking ? 0.25 : 1, springs.gentle);
	}, [isCooking]);

	return (
		<SCPWindow
			backgroundTransparency={backgroundTransparency}
			size={new UDim2(0, rem(78), 0, rem(28))}
			isOpen={isCooking}
			onClose={() => {
				clientStore.setCookingOpen(false);
			}}
		>
			<Image
				imageTransparency={backgroundTransparency}
				size={UDim2.fromOffset(rem(5), rem(5))}
				position={UDim2.fromOffset(rem(1), rem(0.5))}
				image={images.ui.misc.foundationlogo}
			/>
			<Text
				text="CULINARY SYSTEM"
				position={UDim2.fromOffset(rem(7), rem(2))}
				size={UDim2.fromOffset(rem(30), rem(2.5))}
				textColor={Color3.fromRGB(255, 255, 255)}
				textSize={rem(2.5)}
				backgroundTransparency={1}
				textTransparency={backgroundTransparency}
				textWrapped={true}
				textXAlignment="Left"
				textYAlignment="Center"
				font={fonts.inter.bold}
			/>
			<Image
				size={UDim2.fromOffset(rem(45), rem(0.25))}
				position={UDim2.fromOffset(rem(0), rem(5.25))}
				imageTransparency={backgroundTransparency}
				image={images.ui.misc.divider}
			/>

			<SCPClock
				position={UDim2.fromOffset(rem(78), rem(33))}
				anchorPoint={new Vector2(1, 0)}
				size={UDim2.fromOffset(rem(30), rem(1.5))}
				textTransparency={backgroundTransparency.map((transparency) => math.clamp(transparency + 0.25, 0, 1))}
			/>
			<FoodSelection
				size={UDim2.fromOffset(rem(60), rem(24))}
				position={UDim2.fromOffset(rem(6), rem(12))}
				backgroundTransparency={backgroundTransparency}
			/>
		</SCPWindow>
	);
}
