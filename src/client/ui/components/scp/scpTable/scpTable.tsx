import { useBindingState } from "@rbxts/pretty-react-hooks";
import Roact from "@rbxts/roact";
import { useRem } from "client/ui/hooks";
import { fonts } from "shared/constants/fonts";
import { palette } from "shared/constants/palette";
import { ButtonProps } from "../../../library/button/button";
import { Frame, FrameProps } from "../../../library/frame";
import { Group } from "../../../library/group";
import { Text } from "../../../library/text";

interface SelectionTableProps extends FrameProps {
	items: string[];
	header: string;
	ItemComponent: (props: ButtonProps) => Roact.Element;
	onItemClicked?: (item: string) => void;
}

export const SCPTable = (props: SelectionTableProps) => {
	const rem = useRem();
	const backgroundTransparency = useBindingState(props.backgroundTransparency ?? 0);
	const { items, ItemComponent } = props;
	return (
		<Group
			size={props.size}
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
			{items.map((item, key) => (
				<ItemComponent
					text={item}
					key={`item${key}`}
					onClick={() => props.onItemClicked?.(item)}
					backgroundTransparency={backgroundTransparency}
				/>
			))}
		</Group>
	);
};
