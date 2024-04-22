import Roact, { useEffect, useState } from "@rbxts/roact";
import { useMotion, useRem } from "client/ui/hooks";
import { Button, ButtonProps } from "client/ui/library/button/button";
import { Text } from "client/ui/library/text";
import { fonts } from "shared/constants/fonts";
import { palette } from "shared/constants/palette";
import { SCPToggle } from "../toggle";

interface SCPToggleTableItemProps extends ButtonProps {
	active: boolean;
}

export const SCPToggleTableItem = (props: SCPToggleTableItemProps) => {
	const rem = useRem();
	const [hovered, setHovered] = useState(false);
	const [hover, hoverMotion] = useMotion(0);

	useEffect(() => {
		hoverMotion.spring(hovered ? 1 : 0);
	}, [hovered]);

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
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
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
			<SCPToggle
				active={props.active}
				hovered={hovered}
				size={new UDim2(0, rem(1.25), 0, rem(1.25))}
				anchorPoint={new Vector2(1, 0.5)}
				position={new UDim2(1, -rem(1), 0.5, 0)}
			/>
		</Button>
	);
};
