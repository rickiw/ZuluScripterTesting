import { useSelector } from "@rbxts/react-reflex";
import Roact from "@rbxts/roact";
import { selectOperatingSystemOpen } from "client/store/operating-system";
import { Frame } from "client/ui//library/frame";

interface MenuPage {
	visible: boolean;
	title: string;
}

export function RightPanel() {
	const OperatingSystemOpen = useSelector(selectOperatingSystemOpen);

	return (
		<Frame
			key={"Panel"}
			backgroundColor={Color3.fromRGB(16, 20, 21)}
			borderColor={Color3.fromRGB(200, 200, 200)}
			borderSize={5}
			position={UDim2.fromScale(0.488, 0.065)}
			size={UDim2.fromScale(0.474, 0.87)}
		/>
	);
}
