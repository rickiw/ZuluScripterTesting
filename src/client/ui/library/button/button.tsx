import Roact from "@rbxts/roact";
import { TextProps } from "../text";

export interface ButtonProps extends TextProps<TextButton> {
	text?: string;
	active?: boolean | Roact.Binding<boolean>;
	fontFace?: Font | Roact.Binding<Font>;
	textColor?: Color3 | Roact.Binding<Color3>;
	textSize?: number | Roact.Binding<number>;
	textWrapped?: boolean | Roact.Binding<boolean>;
	onClick?: () => void;
	onMouseDown?: () => void;
	onMouseUp?: () => void;
	onMouseEnter?: () => void;
	onMouseLeave?: () => void;
}

export function Button(props: ButtonProps) {
	const { text, onClick, onMouseDown, onMouseEnter, onMouseLeave, onMouseUp } = props;
	const event = {
		Activated: onClick && (() => onClick()),
		MouseButton1Down: onMouseDown && (() => onMouseDown()),
		MouseButton1Up: onMouseUp && (() => onMouseUp()),
		MouseEnter: onMouseEnter && (() => onMouseEnter()),
		MouseLeave: onMouseLeave && (() => onMouseLeave()),
		...props.event,
	};

	return (
		<textbutton
			Active={props.active}
			Text={text || ""}
			AutoButtonColor={false}
			Size={props.size}
			Position={props.position}
			AnchorPoint={props.anchorPoint}
			BackgroundColor3={props.backgroundColor}
			BackgroundTransparency={props.backgroundTransparency}
			ClipsDescendants={props.clipsDescendants}
			Visible={props.visible}
			ZIndex={props.zIndex}
			LayoutOrder={props.layoutOrder}
			BorderColor3={props.borderColor}
			BorderSizePixel={props.borderSize || 0}
			TextColor3={props.textColor}
			TextSize={props.textSize}
			FontFace={props.fontFace}
			TextWrapped={props.textWrapped}
			Font={Enum.Font.Unknown}
			TextTransparency={props.textTransparency}
			TextXAlignment={props.textXAlignment}
			TextYAlignment={props.textYAlignment}
			TextTruncate={props.textTruncate}
			TextScaled={props.textScaled}
			LineHeight={props.textHeight}
			Event={event}
			Change={props.change || {}}
		>
			{props.cornerRadius && <uicorner key="corner" CornerRadius={props.cornerRadius} />}
			{props.children}
		</textbutton>
	);
}
