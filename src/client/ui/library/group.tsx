import Roact, { forwardRef } from "@rbxts/roact";

export interface GroupProps extends Roact.PropsWithChildren {
	ref?: Roact.Ref<Frame>;
	event?: Roact.JsxInstanceEvents<Frame>;
	change?: Roact.JsxInstanceChangeEvents<Frame>;
	size?: UDim2 | Roact.Binding<UDim2>;
	autoSize?: Enum.AutomaticSize | Roact.Binding<Enum.AutomaticSize>;
	position?: UDim2 | Roact.Binding<UDim2>;
	anchorPoint?: Vector2 | Roact.Binding<Vector2>;
	rotation?: number | Roact.Binding<number>;
	clipsDescendants?: boolean | Roact.Binding<boolean>;
	layoutOrder?: number | Roact.Binding<number>;
	visible?: boolean | Roact.Binding<boolean>;
	zIndex?: number | Roact.Binding<number>;
}

export const Group = forwardRef((props: GroupProps, ref: Roact.Ref<Frame>) => {
	return (
		<frame
			ref={ref}
			Size={props.size || UDim2.fromScale(1, 1)}
			AutomaticSize={props.autoSize || Enum.AutomaticSize.None}
			Position={props.position}
			AnchorPoint={props.anchorPoint}
			Rotation={props.rotation}
			ClipsDescendants={props.clipsDescendants}
			LayoutOrder={props.layoutOrder}
			Visible={props.visible}
			ZIndex={props.zIndex}
			BackgroundTransparency={1}
			Event={props.event || {}}
			Change={props.change || {}}
		>
			{props.children}
		</frame>
	);
});
