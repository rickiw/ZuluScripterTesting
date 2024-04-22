import { useBindingState } from "@rbxts/pretty-react-hooks";
import Roact from "@rbxts/roact";
import { useRem } from "client/ui/hooks";
import { Frame, FrameProps } from "client/ui/library/frame";
import { Group } from "client/ui/library/group";
import { Text } from "client/ui/library/text";
import { fonts } from "shared/constants/fonts";
import { palette } from "shared/constants/palette";

interface SelectionTableProps extends FrameProps {
	header: string;
}

export const SCPTable = (props: SelectionTableProps) => {
	const rem = useRem();
	const backgroundTransparency = useBindingState(props.backgroundTransparency ?? 0);
	return (
		<Group
			size={props.size}
			autoSize={Enum.AutomaticSize.Y}
			position={props.position}
			anchorPoint={props.anchorPoint}
			rotation={props.rotation}
			clipsDescendants={props.clipsDescendants}
			visible={props.visible}
			zIndex={props.zIndex}
			layoutOrder={props.layoutOrder}
		>
			<uilistlayout
				FillDirection={Enum.FillDirection.Vertical}
				HorizontalAlignment={Enum.HorizontalAlignment.Left}
				VerticalAlignment={Enum.VerticalAlignment.Top}
			/>
			<Frame
				size={new UDim2(1, 0, 0, rem(2))}
				backgroundTransparency={backgroundTransparency}
				backgroundColor={palette.surface1}
				borderColor={palette.surface1}
				borderSize={1}
			>
				<Text
					text={props.header.upper()}
					position={new UDim2(0, rem(0.5), 0, rem(0.25))}
					size={new UDim2(0, 0, 0, rem(1.5))}
					textAutoResize="X"
					textColor={palette.subtext0}
					textSize={rem(1.5)}
					textTransparency={backgroundTransparency}
					backgroundTransparency={1}
					textWrapped={true}
					textXAlignment="Left"
					textYAlignment="Center"
					font={fonts.inter.extra}
				/>
			</Frame>
			{props.children}
		</Group>
	);
};
