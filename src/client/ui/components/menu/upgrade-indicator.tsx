import Roact from "@rbxts/roact";
import { useMotion, useRem } from "client/ui/hooks";
import { fonts } from "shared/constants/fonts";
import { springs } from "shared/constants/springs";
import { Frame } from "../../library/frame";
import { Text } from "../../library/text";

interface UpgradeIndicatorProps {
	modification: WeaponModificationMount;
	clicked: () => void;
}

export function UpgradeIndicator({ modification, clicked }: UpgradeIndicatorProps) {
	const rem = useRem();

	const [indicatorSize, indicatorSizeMotion] = useMotion(UDim2.fromScale(0.6, 0.6));
	const [indicatorRotation, indicatorRotationMotion] = useMotion(45);
	const [indicatorTransparency, indicatorTransparencyMotion] = useMotion(0.5);
	const [hoverIndicatorSize, hoverIndicatorSizeMotion] = useMotion(UDim2.fromScale(0, 0));
	const [textPosition, textPositionMotion] = useMotion(UDim2.fromScale(0, 0));
	const [textTransparency, textTransparencyMotion] = useMotion(1);

	return (
		<>
			<textbutton
				Size={UDim2.fromScale(1, 1)}
				BackgroundTransparency={1}
				Text=""
				Event={{
					MouseEnter: () => {
						indicatorSizeMotion.spring(UDim2.fromScale(0, 0), springs.bubbly);
						indicatorTransparencyMotion.spring(1, springs.stiff);
						indicatorRotationMotion.spring(0, springs.wobbly);
						hoverIndicatorSizeMotion.spring(UDim2.fromScale(0.5, 0.5), springs.stiff);
						textPositionMotion.spring(UDim2.fromScale(0, 0.7), springs.stiff);
						textTransparencyMotion.spring(0, springs.stiff);
					},
					MouseLeave: () => {
						indicatorSizeMotion.spring(UDim2.fromScale(0.6, 0.6), springs.bubbly);
						indicatorTransparencyMotion.spring(0.5, springs.stiff);
						indicatorRotationMotion.spring(45, springs.wobbly);
						hoverIndicatorSizeMotion.spring(UDim2.fromScale(0, 0), springs.stiff);
						textPositionMotion.spring(UDim2.fromScale(0, 0), springs.stiff);
						textTransparencyMotion.spring(1, springs.stiff);
					},
					MouseButton1Click: () => {
						clicked();
					},
				}}
			>
				<Frame
					backgroundTransparency={indicatorTransparency}
					anchorPoint={new Vector2(0.5, 0.5)}
					position={UDim2.fromScale(0.5, 0.5)}
					backgroundColor={Color3.fromRGB(255, 255, 255)}
					size={indicatorSize}
					rotation={indicatorRotation}
				/>
				<Text
					size={UDim2.fromScale(1, 1)}
					text={modification.Name}
					position={textPosition}
					textColor={Color3.fromRGB(255, 255, 255)}
					textTransparency={textTransparency}
					font={fonts.gothic.bold}
					textSize={rem(1.5)}
				/>

				<Frame
					size={hoverIndicatorSize}
					anchorPoint={new Vector2(0.5, 0.5)}
					backgroundTransparency={0.5}
					zIndex={0}
					backgroundColor={Color3.fromRGB(255, 242, 13)}
					position={UDim2.fromScale(0.5, 0.5)}
				>
					<uicorner CornerRadius={new UDim(1, 0)} />
				</Frame>
			</textbutton>
		</>
	);
}
