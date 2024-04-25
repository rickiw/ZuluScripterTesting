import Roact, { useEffect } from "@rbxts/roact";
import { useMotion } from "client/ui/hooks";
import { Button, ButtonProps } from "client/ui/library/button/button";
import { palette } from "shared/constants/palette";

interface SCPToggleProps extends ButtonProps {
	active: boolean;
	hovered?: boolean;
}

export const SCPToggle = (props: SCPToggleProps) => {
	const [hover, hoverMotion] = useMotion(0);
	useEffect(() => {
		if (props.hovered !== undefined) {
			hoverMotion.spring(props.hovered ? 1 : 0);
		}
	}, [props.hovered]);

	return (
		<Button
			text=""
			size={props.size}
			position={props.position}
			anchorPoint={props.anchorPoint}
			backgroundColor={hover.map((value) => {
				if (props.active) {
					return palette.overlay1.Lerp(palette.overlay0, value / 4);
				}
				return palette.surface0.Lerp(palette.overlay1, value / 4);
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
		</Button>
	);
};
