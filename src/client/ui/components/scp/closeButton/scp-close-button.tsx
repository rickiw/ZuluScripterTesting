import Roact from "@rbxts/roact";
import { useMotion, useRem } from "client/ui/hooks";
import { Button, ButtonProps } from "client/ui/library/button/button";
import { Image } from "client/ui/library/image";
import { images } from "shared/assets/images";
import { palette } from "shared/constants/palette";

interface SCPCloseButtonProps extends ButtonProps {}

export const SCPCloseButton = (props: SCPCloseButtonProps) => {
	const rem = useRem();
	const [hover, hoverMotion] = useMotion(0);

	return (
		<Button
			text=""
			size={new UDim2(0, rem(2), 0, rem(2))}
			anchorPoint={new Vector2(1, 0)}
			position={new UDim2(1, -rem(0.5), 0, rem(0.5))}
			backgroundColor={hover.map((value) => {
				return palette.surface0.Lerp(palette.surface1, value);
			})}
			backgroundTransparency={props.backgroundTransparency}
			borderColor={hover.map((value) => {
				return palette.white.Lerp(palette.surface2, value);
			})}
			onClick={props.onClick}
			onMouseEnter={() => hoverMotion.spring(1)}
			onMouseLeave={() => hoverMotion.spring(0)}
			borderSize={1}
		>
			<uiaspectratioconstraint AspectRatio={1} />
			<Image
				zIndex={2}
				anchorPoint={new Vector2(0.5, 0.5)}
				size={new UDim2(1, 0, 1, 0)}
				position={new UDim2(0.5, 0, 0.5, 0)}
				image={images.ui.misc.close}
				imageColor={hover.map((value) => {
					return palette.white.Lerp(palette.surface2, value);
				})}
				imageTransparency={props.backgroundTransparency}
				borderSize={0}
				backgroundTransparency={1}
			/>
		</Button>
	);
};
