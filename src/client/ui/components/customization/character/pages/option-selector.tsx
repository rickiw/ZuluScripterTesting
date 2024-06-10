import Roact, { useEffect } from "@rbxts/roact";
import { useMotion, useRem } from "client/ui/hooks";
import { Button } from "client/ui/library/button/button";
import { Frame } from "client/ui/library/frame";
import { Image } from "client/ui/library/image";
import { images } from "shared/assets/images";
import { springs } from "shared/constants/springs";

export interface OptionSelectorProps {
	color: Color3;
	selected: boolean;
	previewImage?: string;
	layoutOrder?: number;
	clicked?: () => void;
}

export function OptionSelector({ color, selected, previewImage, layoutOrder, clicked }: OptionSelectorProps) {
	const rem = useRem();

	const [effectTransparency, effectTransparencyMotion] = useMotion(1);
	const [colorEffect, colorEffectMotion] = useMotion(color);

	useEffect(() => {
		colorEffectMotion.spring(color, springs.responsive);
	}, [color]);

	return (
		<>
			<Button
				layoutOrder={layoutOrder}
				backgroundTransparency={1}
				event={{
					MouseButton1Click: () => {
						if (clicked) {
							clicked();
						}
					},
					MouseEnter: () => {
						effectTransparencyMotion.spring(0, springs.responsive);
					},
					MouseLeave: () => {
						effectTransparencyMotion.spring(1, springs.responsive);
					},
				}}
			>
				<uistroke
					Color={Color3.fromRGB(166, 166, 166)}
					ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
					Transparency={0}
				/>
				<uiaspectratioconstraint AspectRatio={1} />

				<Frame size={new UDim2(1, 0, 1, -rem(1.5))} backgroundTransparency={1}>
					<>
						<Image
							size={UDim2.fromScale(1, 1)}
							scaleType="Stretch"
							image={images.ui.misc.selectionbackground}
							imageTransparency={effectTransparency}
						/>
						{previewImage && (
							<>
								<Image
									size={UDim2.fromScale(1, 1)}
									image={previewImage}
									backgroundTransparency={1}
									backgroundColor={Color3.fromRGB(210, 210, 210)}
								/>
							</>
						)}
					</>
				</Frame>

				<Frame
					backgroundColor={colorEffect}
					size={new UDim2(1, 0, 0, rem(1.5))}
					position={new UDim2(0, 0, 1, -rem(1.5))}
				/>
			</Button>
		</>
	);
}
