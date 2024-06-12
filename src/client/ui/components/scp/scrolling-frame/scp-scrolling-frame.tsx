import Roact, { Ref, forwardRef } from "@rbxts/roact";
import { useRem } from "client/ui/hooks";
import { FrameProps } from "client/ui/library/frame";
import { Group } from "client/ui/library/group";
import { images } from "shared/assets/images";
import { palette } from "shared/constants/palette";
import AutomaticSize = Enum.AutomaticSize;

export interface SCPScrollingFrameProps<T extends Instance = ScrollingFrame> extends FrameProps<T> {
	canvasSize?: UDim2 | Roact.Binding<UDim2>;
	canvasPos?: Vector2 | Roact.Binding<Vector2>;
	automaticCanvasSizing?: AutomaticSize | "None" | "X" | "Y" | "XY" | Roact.Binding<AutomaticSize>;
	automaticSizing?: AutomaticSize | "None" | "X" | "Y" | "XY" | Roact.Binding<AutomaticSize>;
	scrollBarImageTransparency?: number | Roact.Binding<number>;
	scrollDirection?: Enum.ScrollingDirection;
	scrollBarTop?: string | Roact.Binding<string>;
	scrollBarMid?: string | Roact.Binding<string>;
	scrollBarBottom?: string | Roact.Binding<string>;
}

export const SCPScrollingFrame = forwardRef((props: SCPScrollingFrameProps, ref: Ref<ScrollingFrame>) => {
	const rem = useRem();
	return (
		<scrollingframe
			ref={ref}
			Size={props.size}
			ScrollBarThickness={rem(1)}
			AutomaticSize={props.automaticSizing}
			CanvasSize={props.canvasSize}
			CanvasPosition={props.canvasPos}
			Position={props.position}
			AnchorPoint={props.anchorPoint}
			Rotation={props.rotation}
			BackgroundColor3={palette.surface0}
			BackgroundTransparency={props.backgroundTransparency}
			BorderColor3={props.borderColor}
			ClipsDescendants={props.clipsDescendants}
			Visible={props.visible}
			ZIndex={props.zIndex}
			LayoutOrder={props.layoutOrder}
			ScrollBarImageColor3={palette.white}
			ScrollingDirection={props.scrollDirection || Enum.ScrollingDirection.Y}
			BorderSizePixel={props.borderSize || 0}
			ScrollBarImageTransparency={props.scrollBarImageTransparency}
			TopImage={images.ui.icons.scrollbartop}
			MidImage={images.ui.icons.scrollbarmid}
			BottomImage={images.ui.icons.scrollbarbot}
			AutomaticCanvasSize={props.automaticCanvasSizing}
			Event={props.event || {}}
			Change={props.change || {}}
		>
			<Group size={new UDim2(1, -rem(1), 0, 0)} autoSize={Enum.AutomaticSize.Y}>
				{props.cornerRadius && <uicorner key="corner" CornerRadius={props.cornerRadius} />}
				{props.children}
			</Group>
		</scrollingframe>
	);
});
