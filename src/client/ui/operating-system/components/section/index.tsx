import Roact from "@rbxts/roact";
import { usePx } from "client/ui/hooks/use-pix";
import { Frame, ScrollingFrame } from "client/ui/library/frame";
import { LeftPanelTitle } from "./left-panel-options";
export interface SectionProps extends Roact.PropsWithChildren {
	FrameSize: number;
	Title: string;
}

export function LeftPanelSection(props: SectionProps) {
	const rem = usePx();
	return (
		<Frame size={new UDim2(1, 0, 0, rem(props.FrameSize))} backgroundTransparency={1}>
			<uilistlayout SortOrder={Enum.SortOrder.LayoutOrder} />
			<LeftPanelTitle text={props.Title} LayoutOrder={2} />
			<ScrollingFrame
				layoutOrder={3}
				key={"Panel"}
				backgroundColor={Color3.fromHex("#191D20")}
				size={new UDim2(1, 0, 0, rem(props.FrameSize - 30))}
				canvasSize={new UDim2(1, 0, 0, rem(450))}
				borderSize={1}
				borderColor={Color3.fromRGB(60, 65, 70)}
				borderMode={"Inset"}
			>
				<uilistlayout />
				{props.children}
			</ScrollingFrame>
		</Frame>
	);
}
