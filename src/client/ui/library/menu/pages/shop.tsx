import Roact from "@rbxts/roact";
import { MenuPageProps } from ".";
import { Frame } from "../../frame";

export function Shop({ visible, onClose }: MenuPageProps) {
	return (
		<Frame
			anchorPoint={new Vector2(0.5, 0.5)}
			backgroundTransparency={0.7}
			position={UDim2.fromScale(0.5, 0.5)}
			size={UDim2.fromScale(1, 1)}
			visible={visible}
		></Frame>
	);
}
