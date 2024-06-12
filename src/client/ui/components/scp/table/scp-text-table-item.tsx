import Roact from "@rbxts/roact";
import { useMotion, useRem } from "client/ui/hooks";
import { Button, ButtonProps } from "client/ui/library/button/button";
import { Text } from "client/ui/library/text";
import { fonts } from "shared/constants/fonts";
import { palette } from "shared/constants/palette";

interface SCPTextTableItemProps extends ButtonProps {
	subText?: string;
}

export const SCPTextTableItem = (props: SCPTextTableItemProps) => {
	const rem = useRem();
	const [hover, hoverMotion] = useMotion(0);

	return (
		<Button
			text=""
			size={new UDim2(1, 0, 0, rem(2))}
			backgroundColor={hover.map((value) => {
				return palette.surface0.Lerp(palette.surface1, value);
			})}
			backgroundTransparency={props.backgroundTransparency}
			borderColor={hover.map((value) => {
				return palette.surface1.Lerp(palette.surface2, value);
			})}
			onClick={props.onClick}
			onMouseEnter={() => hoverMotion.spring(1)}
			onMouseLeave={() => hoverMotion.spring(0)}
			borderSize={1}
		>
			<Text
				zIndex={2}
				size={new UDim2(0, rem(8), 0, rem(1.5))}
				position={new UDim2(0, rem(0.5), 0, rem(0.25))}
				textColor={props.textColor ?? Color3.fromRGB(255, 255, 255)}
				textAutoResize="X"
				backgroundTransparency={1}
				textSize={rem(1.5)}
				font={fonts.robotoMono.regular}
				text={props.text?.upper()}
				textXAlignment="Left"
				textYAlignment="Center"
			/>
			{props.subText ? (
				<Text
					zIndex={2}
					size={new UDim2(0, rem(8), 0, rem(1.5))}
					position={new UDim2(1, -rem(1), 0, rem(0.25))}
					textColor={props.textColor ?? palette.subtext0}
					textAutoResize="X"
					backgroundTransparency={1}
					anchorPoint={new Vector2(1, 0)}
					textSize={rem(1.5)}
					font={fonts.inter.bold}
					text={props.subText}
					textXAlignment="Right"
					textYAlignment="Center"
				/>
			) : (
				<></>
			)}
		</Button>
	);
};
