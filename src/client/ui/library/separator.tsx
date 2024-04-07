import Roact from "@rbxts/roact";
import { Frame } from "./frame";

interface SeparatorProps {
	size: UDim2;
	position: UDim2;
}

export function Separator({ size, position }: SeparatorProps) {
	return (
		<Frame
			backgroundColor={Color3.fromRGB(255, 255, 255)}
			size={size}
			position={position}
			backgroundTransparency={0}
		/>
	);
}
