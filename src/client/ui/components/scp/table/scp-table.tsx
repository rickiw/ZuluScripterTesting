import { useBindingState } from "@rbxts/pretty-react-hooks";
import Roact, { useEffect, useRef, useState } from "@rbxts/roact";
import { useRem } from "client/ui/hooks";
import { Frame, FrameProps } from "client/ui/library/frame";
import { Group } from "client/ui/library/group";
import { Text } from "client/ui/library/text";
import { fonts } from "shared/constants/fonts";
import { palette } from "shared/constants/palette";
import { SCPScrollingFrame } from "../scrolling-frame";

const TableHeader = (props: { header: string; backgroundTransparency?: Roact.Binding<number> | number }) => {
	const rem = useRem();
	return (
		<Frame
			layoutOrder={0}
			size={new UDim2(1, 0, 0, rem(2))}
			backgroundTransparency={props.backgroundTransparency}
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
				textTransparency={props.backgroundTransparency}
				backgroundTransparency={1}
				textWrapped={true}
				textXAlignment="Left"
				textYAlignment="Center"
				font={fonts.inter.extra}
			/>
		</Frame>
	);
};

interface SelectionTableProps extends FrameProps {
	header: string;
	scrollable?: boolean;
}

export const SCPTable = (props: SelectionTableProps) => {
	const rem = useRem();
	const ref = useRef<Frame>();
	const currentSize = useBindingState(props.size ?? new UDim2(1, 0, 0, 0));
	const [needsScroll, setNeedsScroll] = useState(false);
	const backgroundTransparency = useBindingState(props.backgroundTransparency ?? 0);
	useEffect(() => {
		if (ref.current !== undefined && props.children !== undefined) {
			setNeedsScroll(ref.current.AbsoluteSize.Y < rem(props.children.size() * 2 + 2));
		}
	}, [ref, props.children]);
	return (
		<Group
			size={props.size}
			ref={ref}
			autoSize={props.scrollable ? Enum.AutomaticSize.None : Enum.AutomaticSize.Y}
			position={props.position}
			anchorPoint={props.anchorPoint}
			rotation={props.rotation}
			clipsDescendants={props.clipsDescendants}
			visible={props.visible}
			zIndex={props.zIndex}
			layoutOrder={props.layoutOrder}
		>
			{props.scrollable && needsScroll ? (
				<>
					<TableHeader header={props.header} backgroundTransparency={props.backgroundTransparency} />
					<SCPScrollingFrame
						size={new UDim2(1, 0, 0, currentSize.Height.Offset - rem(2))}
						anchorPoint={new Vector2(0, 0)}
						automaticCanvasSizing={Enum.AutomaticSize.None}
						canvasSize={new UDim2(0, 0, 0, rem((props.children?.size() ?? 0) * 2))}
						position={new UDim2(0, 0, 0, rem(2))}
						backgroundTransparency={0.5}
						clipsDescendants={true}
					>
						<uilistlayout
							FillDirection={Enum.FillDirection.Vertical}
							HorizontalAlignment={Enum.HorizontalAlignment.Left}
							VerticalAlignment={Enum.VerticalAlignment.Top}
						/>
						{props.children}
					</SCPScrollingFrame>
				</>
			) : (
				<>
					<uilistlayout
						FillDirection={Enum.FillDirection.Vertical}
						HorizontalAlignment={Enum.HorizontalAlignment.Left}
						VerticalAlignment={Enum.VerticalAlignment.Top}
					/>
					<TableHeader header={props.header} backgroundTransparency={props.backgroundTransparency} />
					{props.children}
				</>
			)}
		</Group>
	);
};
