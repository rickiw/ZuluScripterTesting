import Roact from "@rbxts/roact";
import { useMotion, useRem } from "client/ui/hooks";
import { images } from "shared/assets/images";
import { fonts } from "shared/constants/fonts";
import { palette } from "shared/constants/palette";
import { Button, ButtonProps } from "../../library/button/button";
import { Frame } from "../../library/frame";
import { Group } from "../../library/group";
import { Image } from "../../library/image";
import { Text } from "../../library/text";

interface MainMenuButtonProps extends ButtonProps {
	index: number;
}

const MainMenuButton = (props: MainMenuButtonProps) => {
	const rem = useRem();
	const [hover, hoverMotion] = useMotion(0);

	return (
		<Button
			text={props.text}
			textXAlignment="Left"
			textSize={rem(2)}
			onClick={props.onClick}
			position={hover.map((value) => new UDim2(0, rem(value), 0, rem(4 * props.index) + rem(2) * props.index))}
			fontFace={fonts.gothic.regular}
			textColor={palette.subtext1}
			size={new UDim2(1, 0, 0, rem(4))}
			onMouseEnter={() => hoverMotion.spring(1)}
			onMouseLeave={() => hoverMotion.spring(0)}
			backgroundColor={hover.map((value) => {
				return palette.surface0.Lerp(palette.surface1, value);
			})}
		/>
	);
};

export function MainMenuProvider() {
	const rem = useRem();

	return (
		<>
			<Frame
				backgroundTransparency={0}
				backgroundColor={palette.base}
				position={UDim2.fromOffset(18.75, 0)}
				size={new UDim2(0, rem(30), 1, 0)}
			>
				<Text
					font={fonts.arimo.bold}
					text={"SITE ZULU"}
					textSize={rem(4)}
					textXAlignment="Left"
					size={new UDim2(1, 0, 0, rem(4))}
					position={new UDim2(0, rem(1.5), 0, rem(5.5))}
					textColor={palette.white}
				/>
				<Text
					font={fonts.arimo.bold}
					text={"MAIN MENU"}
					textSize={rem(2.5)}
					textXAlignment="Left"
					size={new UDim2(1, 0, 0, rem(2.5))}
					position={new UDim2(0, rem(1.5), 0, rem(9.5))}
					textColor={palette.accent_blue}
				/>
				<Image
					size={new UDim2(1, 0, 0, rem(0.25))}
					position={new UDim2(0, 0, 0, rem(14))}
					image={images.ui.misc.divider}
				/>
				<Group
					size={new UDim2(1, rem(-4), 0.75, 0)}
					position={new UDim2(0.5, 0, 0, rem(17))}
					anchorPoint={new Vector2(0.5, 0)}
				>
					<MainMenuButton text={" AUTO JOIN"} index={0} />
					<MainMenuButton text={" SERVERS"} index={1} />
					<MainMenuButton text={" APPLICATIONS"} index={2} />
				</Group>
				<Image
					image={images.ui.icons.scp_badge}
					anchorPoint={new Vector2(0, 0.5)}
					position={UDim2.fromScale(0, 1)}
					imageColor={palette.surface1}
					size={new UDim2(1, 0, 1, 0)}
				>
					<uiaspectratioconstraint AspectRatio={1} />
				</Image>
			</Frame>
		</>
	);
}
