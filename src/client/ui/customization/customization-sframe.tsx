import Roact from "@rbxts/roact";
import { ScrollingFrame, ScrollingFrameProps } from "client/ui/library/frame";

export interface CustomizationFrameProps<T extends Instance = ScrollingFrame> extends ScrollingFrameProps<T> {}

export function CustomizationFrame(props: CustomizationFrameProps) {
	return (
		<ScrollingFrame
			backgroundTransparency={1}
			position={props.position}
			size={props.size}
			automaticSizing={"Y"}
			scrollBarImageTransparency={1}
		>
			{props.children}
		</ScrollingFrame>
	);
}
