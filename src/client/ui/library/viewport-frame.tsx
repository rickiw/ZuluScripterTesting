import Roact, { Ref, forwardRef } from "@rbxts/roact";
import { FrameProps } from "./frame";

export interface ViewportFrameProps<T extends Instance = ViewportFrame> extends FrameProps<T> {
	currentCamera?: Camera | Roact.Binding<Camera>;
}

export const ViewportFrame = forwardRef((props: ViewportFrameProps, ref: Ref<ViewportFrame>) => {
	return (
		<viewportframe
			ref={ref}
			Size={props.size}
			Position={props.position}
			AnchorPoint={props.anchorPoint}
			Rotation={props.rotation}
			BackgroundColor3={props.backgroundColor}
			BackgroundTransparency={props.backgroundTransparency}
			BorderColor3={props.borderColor}
			ClipsDescendants={props.clipsDescendants}
			Visible={props.visible}
			ZIndex={props.zIndex}
			LayoutOrder={props.layoutOrder}
			BorderSizePixel={props.borderSize || 0}
			Event={props.event || {}}
			Change={props.change || {}}
			CurrentCamera={props.currentCamera}
		>
			{props.children}
		</viewportframe>
	);
});
