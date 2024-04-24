import Roact, { useEffect } from "@rbxts/roact";
import { useMotion, useRem } from "client/ui/hooks";
import { Frame } from "client/ui/library/frame";
import { Image } from "client/ui/library/image";
import { Text } from "client/ui/library/text";
import { images } from "shared/assets/images";
import { fonts } from "shared/constants/fonts";
import { palette } from "shared/constants/palette";
import { springs } from "shared/constants/springs";

interface NotificationProps {
	title: string;
	subtitle: string;
	content: string;
	open: boolean;
}

export const Notification = (props: NotificationProps) => {
	const rem = useRem();
	const { open, title, subtitle, content } = props;
	const [backgroundTransparency, backgroundTransparencyMotion] = useMotion(1);
	const [position, positionMotion] = useMotion(new UDim2(1, rem(1), 0.9, 0));

	useEffect(() => {
		const offset = open ? 0.9 : 1;
		backgroundTransparencyMotion.spring(open ? 0 : 1, springs.gentle);
		positionMotion.spring(new UDim2(1, rem(1), offset, 0), springs.stiff);
	}, [open]);

	return (
		<Frame
			size={UDim2.fromOffset(rem(20), rem(9))}
			position={position}
			anchorPoint={new Vector2(1, 1)}
			backgroundColor={palette.surface0}
			clipsDescendants={true}
			backgroundTransparency={backgroundTransparency}
		>
			<uicorner CornerRadius={new UDim(0, rem(0.5))} />
			<Frame
				size={UDim2.fromOffset(rem(20), rem(1.75))}
				position={UDim2.fromOffset(rem(0), rem(1))}
				backgroundTransparency={backgroundTransparency}
				backgroundColor={palette.surface1}
			/>
			<Frame
				size={UDim2.fromOffset(rem(20), rem(2.75))}
				backgroundTransparency={backgroundTransparency}
				backgroundColor={palette.surface1}
			>
				<uicorner CornerRadius={new UDim(0, rem(0.5))} />
				<Text
					position={UDim2.fromOffset(rem(0.5), rem(0.25))}
					size={new UDim2(0, rem(17), 0, rem(1.5))}
					textSize={rem(1.5)}
					textXAlignment="Left"
					textTruncate="AtEnd"
					textYAlignment="Bottom"
					text={title.upper()}
					textColor={palette.white}
					font={fonts.inter.bold}
					textTransparency={backgroundTransparency}
				></Text>
				<Text
					position={UDim2.fromOffset(rem(0.5), rem(1.5))}
					size={new UDim2(0, rem(17), 0, rem(1.25))}
					textSize={rem(1.25)}
					textTruncate="AtEnd"
					text={subtitle?.upper() ?? ""}
					textColor={palette.subtext0}
					textTransparency={backgroundTransparency}
					textXAlignment="Left"
					textYAlignment="Top"
					font={fonts.inter.regular}
				></Text>
				<Image
					image={images.ui.icons.notification}
					imageTransparency={backgroundTransparency}
					size={new UDim2(0, rem(2.5), 0, rem(2.5))}
					position={new UDim2(0, rem(17), 0, rem(0.125))}
					anchorPoint={new Vector2(0.5, 0)}
					backgroundTransparency={1}
				/>
			</Frame>
			<Image
				size={new UDim2(1, 0, 0, rem(0.2))}
				position={UDim2.fromOffset(rem(0), rem(2.75))}
				anchorPoint={new Vector2(0, 0.5)}
				imageTransparency={backgroundTransparency}
				image={images.ui.misc.divider}
			/>
			<Text
				text={content}
				textTransparency={backgroundTransparency}
				position={UDim2.fromOffset(rem(0.5), rem(3))}
				size={UDim2.fromOffset(rem(19), rem(7))}
				font={fonts.arimo.regular}
				textWrapped
				textXAlignment="Left"
				textYAlignment="Top"
				textSize={rem(1.5)}
				textColor={palette.white}
			/>
		</Frame>
	);
};
