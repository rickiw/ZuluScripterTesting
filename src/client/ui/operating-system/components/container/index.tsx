import { useSelector } from "@rbxts/react-reflex";
import Roact from "@rbxts/roact";
import { selectOperatingSystemOpen } from "client/store/operating-system";
import { Frame } from "client/ui//library/frame";
import { usePx } from "client/ui/hooks/use-pix";
import { Image } from "client/ui/library/image";
import { Text } from "client/ui/library/text";
import { fonts } from "shared/constants/fonts";
import { OperatingSystemLeftPanel } from "./left-panel";
import { OperatingSystemRightPanel } from "./right-panel";

interface MenuPage {
	visible: boolean;
	title: string;
}

export function OperatingSystemContainer() {
	const rem = usePx();

	const OperatingSystemOpen = useSelector(selectOperatingSystemOpen);

	return (
		<Frame
			key={"container"}
			anchorPoint={new Vector2(0.5, 0.5)}
			position={UDim2.fromScale(0.5, 0.5)}
			visible={true}
			backgroundColor={Color3.fromRGB(16, 20, 21)}
			borderSize={3}
			borderColor={Color3.fromRGB(200, 200, 200)}
			size={UDim2.fromOffset(rem(1250), rem(700))}
		>
			<Text
				key={"title"}
				textColor={Color3.fromRGB(242, 242, 242)}
				position={UDim2.fromScale(0.0852, 0.025)}
				size={UDim2.fromScale(0.4, 0.075)}
				textScaled={true}
				text={"OPERATING SYSTEM"}
				font={fonts.inter.bold}
				textXAlignment="Left"
			/>
			<Image
				key={"SCP LOGO"}
				position={UDim2.fromScale(0.0168, 0.0214)}
				size={UDim2.fromScale(0.056, 0.0714)}
				image="rbxassetid://17117910626"
			/>
			<OperatingSystemRightPanel />
			<OperatingSystemLeftPanel />
		</Frame>
	);
}
