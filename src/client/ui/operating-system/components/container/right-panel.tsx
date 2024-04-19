import Roact from "@rbxts/roact";
import { Frame } from "client/ui//library/frame";

export function OperatingSystemRightPanel() {
	return (
		<Frame
			visible={true}
			key={"Panel"}
			backgroundColor={Color3.fromRGB(16, 20, 21)}
			borderColor={Color3.fromRGB(200, 200, 200)}
			borderSize={1}
			position={UDim2.fromScale(0.488, 0.065)}
			size={UDim2.fromScale(0.474, 0.87)}
		/>
	);
}
