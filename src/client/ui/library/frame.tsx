import Roact, { forwardRef, Ref } from "@rbxts/roact";
import AutomaticSize = Enum.AutomaticSize;

export interface FrameProps<T extends Instance = Frame | ViewportFrame | ScrollingFrame>
	extends Roact.PropsWithChildren {
	ref?: Roact.Ref<T>;
	event?: Roact.JsxInstanceEvents<T>;
	change?: Roact.JsxInstanceChangeEvents<T>;
	size?: UDim2 | Roact.Binding<UDim2>;
	position?: UDim2 | Roact.Binding<UDim2>;
	anchorPoint?: Vector2 | Roact.Binding<Vector2>;
	rotation?: number | Roact.Binding<number>;
	backgroundColor?: Color3 | Roact.Binding<Color3>;
	backgroundTransparency?: number | Roact.Binding<number>;
	borderColor?: Color3 | Roact.Binding<Color3>;
	borderSize?: number | Roact.Binding<number>;
	clipsDescendants?: boolean | Roact.Binding<boolean>;
	visible?: boolean | Roact.Binding<boolean>;
	zIndex?: number | Roact.Binding<number>;
	layoutOrder?: number | Roact.Binding<number>;
	cornerRadius?: UDim | Roact.Binding<UDim>;
	automaticSize?: AutomaticSize | "None" | "X" | "Y" | "XY" | Roact.Binding<AutomaticSize>;
	borderMode?: "Outline" | "Middle" | "Inset" | Roact.Binding<Enum.BorderMode>;
}

export interface ViewportFrameProps<T extends Instance = ViewportFrame> extends FrameProps<T> {
	camera?: Camera | Roact.Binding<Camera>;
}

export interface ScrollingFrameProps<T extends Instance = ScrollingFrame> extends FrameProps<T> {
	canvasSize?: UDim2 | Roact.Binding<UDim2>;
	automaticSizing?: AutomaticSize | "None" | "X" | "Y" | "XY" | Roact.Binding<AutomaticSize>;
	scrollBarImageTransparency?: number | Roact.Binding<number>;
	borderMode?: "Outline" | "Middle" | "Inset" | Roact.Binding<Enum.BorderMode>;
	scrollBarTop?: string | Roact.Binding<string>;
	scrollBarMid?: string | Roact.Binding<string>;
	scrollBarBottom?: string | Roact.Binding<string>;
}

export const Frame = forwardRef((props: FrameProps, ref: Ref<Frame>) => {
	return (
		<frame
			ref={ref}
			Size={props.size}
			Position={props.position}
			AnchorPoint={props.anchorPoint}
			AutomaticSize={props.automaticSize}
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
			BorderMode={props.borderMode}
		>
			{props.cornerRadius && <uicorner key="corner" CornerRadius={props.cornerRadius} />}
			{props.children}
		</frame>
	);
});

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
			CurrentCamera={props.camera}
			Event={props.event || {}}
			Change={props.change || {}}
		>
			{props.cornerRadius && <uicorner key="corner" CornerRadius={props.cornerRadius} />}
			{props.children}
		</viewportframe>
	);
});

export const ScrollingFrame = forwardRef((props: ScrollingFrameProps, ref: Ref<ScrollingFrame>) => {
	return (
		<scrollingframe
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
			ScrollBarImageTransparency={props.scrollBarImageTransparency}
			TopImage={props.scrollBarTop}
			MidImage={props.scrollBarMid}
			BottomImage={props.scrollBarBottom}
			AutomaticCanvasSize={props.automaticSizing}
			Event={props.event || {}}
			Change={props.change || {}}
			BorderMode={props.borderMode}
		>
			{props.cornerRadius && <uicorner key="corner" CornerRadius={props.cornerRadius} />}
			{props.children}
		</scrollingframe>
	);
});
