import Roact from "@rbxts/roact";
import { Frame } from "client/ui//library/frame";
import { usePx } from "client/ui/hooks/use-pix";
import { LeftPanelSection } from "client/ui/operating-system/components/section";
import { LeftPanelHeader, LeftPanelTextOption } from "../section/left-panel-options";
export function OperatingSystemLeftPanel() {
	const rem = usePx();
	return (
		<Frame
			key={"Panel"}
			backgroundTransparency={1}
			position={UDim2.fromOffset(rem(50), rem(200))}
			size={UDim2.fromOffset(rem(510), rem(400))}
		>
			<uilistlayout Padding={new UDim(0, rem(30))} SortOrder={"LayoutOrder"} />
			<LeftPanelHeader text="TITLE" />
			<LeftPanelSection Title={"PANEL TITLE"} FrameSize={124}>
				<LeftPanelTextOption text={"OPTION"} />
				<LeftPanelTextOption text={"OPTION"} />
			</LeftPanelSection>
			<LeftPanelSection Title={"PANEL TITLE"} FrameSize={154} />
		</Frame>
	);
}
