import { blend, composeBindings, lerpBinding, useUpdateEffect } from "@rbxts/pretty-react-hooks";
import Roact from "@rbxts/roact";

import { useMotion, useRem } from "client/ui/hooks";
import { useButtonAnimation } from "client/ui/hooks/use-button-animation";
import { useButtonState } from "client/ui/hooks/use-button-state";
import { ButtonSoundVariant, buttonDown, buttonUp } from "shared/utils/sounds";
import { Frame } from "../frame";
import { Button } from "./button";

interface ReactiveButtonProps extends Roact.PropsWithChildren {
	onClick?: () => void;
	onMouseDown?: () => void;
	onMouseUp?: () => void;
	onMouseEnter?: () => void;
	onMouseLeave?: () => void;
	onHover?: (hovered: boolean) => void;
	onPress?: (pressed: boolean) => void;
	stylized?: boolean;
	enabled?: boolean;
	size?: UDim2 | Roact.Binding<UDim2>;
	position?: UDim2 | Roact.Binding<UDim2>;
	anchorPoint?: Vector2 | Roact.Binding<Vector2>;
	backgroundColor?: Color3 | Roact.Binding<Color3>;
	backgroundTransparency?: number | Roact.Binding<number>;
	cornerRadius?: UDim | Roact.Binding<UDim>;
	layoutOrder?: number | Roact.Binding<number>;
	animatePosition?: boolean;
	animatePositionStrength?: number;
	animatePositionDirection?: Vector2;
	animateSize?: boolean;
	animateSizeStrength?: number;
	soundVariant?: ButtonSoundVariant;
	zIndex?: number | Roact.Binding<number>;
	event?: Roact.JsxInstanceEvents<TextButton>;
	change?: Roact.JsxInstanceChangeEvents<TextButton>;
}

export function ReactiveButton({
	onClick,
	onMouseDown,
	onMouseUp,
	onMouseEnter,
	onMouseLeave,
	onHover,
	onPress,
	stylized = true,
	enabled = true,
	size,
	position,
	anchorPoint,
	backgroundColor = Color3.fromRGB(255, 255, 255),
	backgroundTransparency = 0,
	cornerRadius,
	layoutOrder,
	zIndex,
	animatePosition = true,
	animatePositionStrength = 1.4,
	animatePositionDirection = new Vector2(-0.5, 0),
	animateSize = true,
	animateSizeStrength = 1.5,
	soundVariant = "default",
	event = {},
	change = {},
	children,
}: ReactiveButtonProps) {
	const rem = useRem();
	const [sizeAnimation, sizeMotion] = useMotion(0);
	const [press, hover, buttonEvents] = useButtonState();
	const animation = useButtonAnimation(press, hover);

	useUpdateEffect(() => {
		if (press) {
			sizeMotion.spring(-0.1, { tension: 300 });
		} else {
			sizeMotion.spring(0, { impulse: 0.05, tension: 300 });
		}
	}, [press]);

	useUpdateEffect(() => {
		onHover?.(hover);
	}, [hover]);

	useUpdateEffect(() => {
		onPress?.(press);
	}, [press]);
	return (
		<Button
			onClick={enabled ? onClick : undefined}
			active={enabled}
			onMouseDown={() => {
				if (!enabled) return;
				buttonEvents.onMouseDown();
				onMouseDown?.();
				buttonDown(soundVariant);
			}}
			onMouseUp={() => {
				if (!enabled) return;
				buttonEvents.onMouseUp();
				onMouseUp?.();
				buttonUp(soundVariant);
			}}
			onMouseEnter={() => {
				buttonEvents.onMouseEnter();
				onMouseEnter?.();
			}}
			onMouseLeave={() => {
				buttonEvents.onMouseLeave();
				onMouseLeave?.();
			}}
			backgroundTransparency={1}
			size={size}
			position={position}
			anchorPoint={anchorPoint}
			layoutOrder={layoutOrder}
			zIndex={zIndex}
			event={event}
			change={change}
		>
			{stylized ? (
				<Frame
					key="button-box"
					backgroundColor={composeBindings(
						animation.hoverOnly,
						animation.press,
						backgroundColor,
						(hover, press, color) => {
							return color.Lerp(new Color3(1, 1, 1), hover * 0.15).Lerp(new Color3(), press * 0.1);
						},
					)}
					backgroundTransparency={composeBindings(
						animation.press,
						backgroundTransparency,
						(press, transparency) => {
							return blend(-press * 0.2, transparency);
						},
					)}
					cornerRadius={cornerRadius}
					anchorPoint={new Vector2(0.5, 0.5)}
					size={lerpBinding(
						animateSize ? sizeAnimation : 0,
						new UDim2(1, 0, 1, 0),
						new UDim2(1, rem(2 * animateSizeStrength), 1, rem(2 * animateSizeStrength)),
					)}
					position={lerpBinding(
						animatePosition ? animation.position : 0,
						new UDim2(0.5, 0, 0.5, 0),
						new UDim2(
							0.5,
							(3 + rem(0.1)) * animatePositionStrength * animatePositionDirection.X,
							0.5,
							(3 + rem(0.1)) * animatePositionStrength * animatePositionDirection.Y,
						),
					)}
				>
					{children}
				</Frame>
			) : (
				children
			)}
		</Button>
	);
}
