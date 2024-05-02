import Roact, { useEffect, useState } from "@rbxts/roact";
import { useMotion, useRem } from "client/ui/hooks";
import { Button } from "client/ui/library/button/button";
import { Frame, FrameProps } from "client/ui/library/frame";
import { Group } from "client/ui/library/group";
import { Image } from "client/ui/library/image";
import { Text } from "client/ui/library/text";
import { images } from "shared/assets/images";
import { fonts } from "shared/constants/fonts";
import { palette } from "shared/constants/palette";
import { springs } from "shared/constants/springs";

interface SCPTabProps {
	page: string;
	index: number;
	icon: string;
	rectOffset?: Vector2;
	rectSize?: Vector2;
	onClick?: () => void;
	selectedPage?: string;
}

interface SCPTabsProps extends FrameProps {
	selectedPage?: string;
	selectedIndex?: number;
	fat?: boolean;
}

export const SCPTab = ({ page, onClick, rectOffset, rectSize, icon, selectedPage }: SCPTabProps) => {
	const rem = useRem();
	const active = selectedPage === page;
	const [hovered, setHovered] = useState(false);
	const [backgroundTransparency, backgroundTransparencyMotion] = useMotion(1);
	const [effectTransparency, effectTransparencyMotion] = useMotion(1);

	useEffect(() => {
		backgroundTransparencyMotion.spring(hovered ? 0.75 : 1, springs.gentle);
		effectTransparencyMotion.spring(hovered ? 0 : 1, springs.gentle);
	}, [hovered]);

	return (
		<Button
			backgroundColor={Color3.fromRGB(143, 149, 111)}
			backgroundTransparency={active ? 0.75 : backgroundTransparency}
			event={{
				MouseEnter: () => setHovered(true),
				MouseLeave: () => setHovered(false),
				MouseButton1Click: () => {
					onClick?.();
				},
			}}
		>
			<Frame
				backgroundTransparency={active ? 0 : effectTransparency}
				backgroundColor={palette.overlay2}
				size={UDim2.fromScale(1, 1)}
				position={UDim2.fromScale(0, 0)}
			/>
			<Frame
				backgroundTransparency={active ? 0 : effectTransparency}
				anchorPoint={new Vector2(0.5, 0.5)}
				position={UDim2.fromScale(0.5, 0.5)}
				backgroundColor={palette.overlay0}
				size={UDim2.fromScale(1, 1)}
			>
				<uiaspectratioconstraint AspectRatio={1.2} />
			</Frame>
			<Image
				anchorPoint={new Vector2(0.5, 0.5)}
				size={UDim2.fromOffset(rem(2.5), rem(2.5))}
				position={UDim2.fromScale(0.5, 0.5)}
				backgroundTransparency={1}
				imageRectOffset={rectOffset}
				imageRectSize={rectSize}
				imageColor={active ? palette.overlay2 : palette.subtext0}
				scaleType="Fit"
				image={icon}
			/>
		</Button>
	);
};

export const SCPTabs = (props: SCPTabsProps) => {
	const rem = useRem();
	const tabSize = UDim2.fromOffset(rem(6), rem(4));
	return (
		<Group size={props.size} position={props.position}>
			<Frame size={UDim2.fromOffset(rem(45), rem(4.5))} backgroundTransparency={1} zIndex={2}>
				<uigridlayout CellPadding={UDim2.fromOffset(0, rem(0))} CellSize={tabSize} />
				{props.children}
			</Frame>
			{!props.fat ? (
				<Image
					size={new UDim2(1, 0, 0, rem(0.2))}
					position={UDim2.fromOffset(rem(0), rem(4.25))}
					anchorPoint={new Vector2(0, 0.5)}
					imageTransparency={props.backgroundTransparency ?? 0}
					image={images.ui.misc.divider}
				/>
			) : (
				<Frame
					size={new UDim2(1, 0, 0, rem(1.5))}
					position={UDim2.fromOffset(0, rem(4))}
					backgroundColor={palette.surface1}
					backgroundTransparency={props.backgroundTransparency}
				/>
			)}
			{props.selectedIndex !== undefined ? (
				<Image
					anchorPoint={new Vector2(0.5, 1)}
					size={UDim2.fromOffset(rem(1), rem(1))}
					scaleType="Fit"
					zIndex={3}
					position={UDim2.fromOffset(
						tabSize.Width.Offset * props.selectedIndex - tabSize.Width.Offset / 2,
						rem(4.25),
					)}
					image={images.ui.icons.toparrow}
				/>
			) : (
				<></>
			)}

			{props.selectedPage ? (
				<Frame
					size={new UDim2(0, rem(5), 0, rem(1.5))}
					autoSize={"X"}
					position={UDim2.fromOffset(
						props.fat ? (math.max(1, props.selectedIndex ?? 0) - 1) * tabSize.Width.Offset : 0,
						rem(props.fat ? 4 : 4.4),
					)}
					backgroundColor={Color3.fromRGB(61, 65, 42)}
					backgroundTransparency={props.backgroundTransparency}
				>
					<uipadding PaddingLeft={new UDim(0, rem(0.5))} PaddingRight={new UDim(0, rem(0.5))} />
					<uilistlayout
						FillDirection={"Horizontal"}
						VerticalAlignment={"Center"}
						HorizontalAlignment={"Center"}
					/>
					<Text
						layoutOrder={1}
						textAutoResize="XY"
						text={props.selectedPage.upper()}
						textSize={rem(1.25)}
						textXAlignment="Left"
						textColor={palette.overlay1}
						font={fonts.robotoMono.regular}
						textTransparency={props.backgroundTransparency}
					/>
					<Group layoutOrder={2} size={UDim2.fromOffset(rem(2), rem(1.5))}></Group>
					<Text
						layoutOrder={3}
						textAutoResize="XY"
						text={string.format("%02d", props.selectedIndex ?? 0)}
						textXAlignment="Right"
						textSize={rem(1.25)}
						textColor={palette.overlay1}
						borderSize={0}
						zIndex={3}
						font={fonts.robotoMono.regular}
						textTransparency={props.backgroundTransparency}
					/>
				</Frame>
			) : (
				<></>
			)}
		</Group>
	);
};
