import { useEventListener } from "@rbxts/pretty-react-hooks";
import { useSelector } from "@rbxts/react-reflex";
import Roact, { useEffect, useState } from "@rbxts/roact";
import { RunService } from "@rbxts/services";
import { selectCookingIsOpen } from "client/store/cooking";
import { Frame } from "client/ui/library/frame";
import { images } from "shared/assets/images";
import { fonts } from "shared/constants/fonts";
import { springs } from "shared/constants/springs";
import { useMotion, useRem } from "../hooks";
import { Image } from "../library/image";
import { Text } from "../library/text";
import { RecipeSelection } from "./recipe-selection";

export function CookingProvider() {
	const rem = useRem();
	const [time, setTime] = useState(DateTime.now().FormatLocalTime("ddd MMM DD hh:mm A", "en-us").upper());
	const isCooking = useSelector(selectCookingIsOpen);
	const [backgroundTransparency, backgroundTransparencyMotion] = useMotion(1);

	useEventListener(RunService.Heartbeat, () => {
		setTime(DateTime.now().FormatLocalTime("ddd MMM DD hh:mm A", "en-us").upper());
	});

	useEffect(() => {
		backgroundTransparencyMotion.spring(isCooking ? 0.25 : 1, springs.gentle);
	}, [isCooking]);

	return (
		<>
			{isCooking && (
				<Frame
					anchorPoint={new Vector2(0.5, 0.5)}
					position={new UDim2(0.5, 0, 0.5, 0)}
					size={new UDim2(0, rem(80), 0, rem(36))}
					backgroundColor={Color3.fromRGB(16, 20, 21)}
					backgroundTransparency={backgroundTransparency}
					borderColor={Color3.fromRGB(255, 255, 255)}
					borderSize={1}
				>
					<Image
						imageTransparency={backgroundTransparency}
						size={UDim2.fromOffset(rem(6), rem(6))}
						position={UDim2.fromOffset(rem(1), rem(1))}
						image={images.ui.misc.foundationlogo}
					/>
					<Text
						text="CULINARY SYSTEM"
						position={UDim2.fromOffset(rem(8), rem(2.75))}
						size={UDim2.fromOffset(rem(30), rem(3))}
						textColor={Color3.fromRGB(255, 255, 255)}
						textSize={rem(3)}
						backgroundTransparency={1}
						textTransparency={backgroundTransparency}
						textWrapped={true}
						textXAlignment="Left"
						textYAlignment="Center"
						font={fonts.inter.bold}
					/>
					<Image
						size={UDim2.fromOffset(rem(45), rem(0.25))}
						position={UDim2.fromOffset(rem(0), rem(7.5))}
						image={images.ui.misc.divider}
					/>

					<Text
						text={time}
						position={UDim2.fromOffset(rem(78), rem(33))}
						anchorPoint={new Vector2(1, 0)}
						size={UDim2.fromOffset(rem(30), rem(1.5))}
						textColor={Color3.fromRGB(255, 255, 255)}
						textSize={rem(1.5)}
						textTransparency={backgroundTransparency.map((transparency) =>
							math.clamp(transparency + 0.25, 0, 1),
						)}
						backgroundTransparency={1}
						textWrapped={true}
						textXAlignment="Right"
						textYAlignment="Center"
						font={fonts.inter.bold}
					/>
					<RecipeSelection
						size={UDim2.fromOffset(rem(60), rem(24))}
						position={UDim2.fromOffset(rem(6), rem(12))}
						backgroundTransparency={backgroundTransparency}
					/>
				</Frame>
			)}
		</>
	);
}
