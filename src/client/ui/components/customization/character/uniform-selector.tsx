import { useSelector } from "@rbxts/react-reflex";
import Roact, { useEffect } from "@rbxts/roact";
import { clientStore } from "client/store";
import { selectCharacterOutfit } from "client/store/customization";
import { useMotion, useRem } from "client/ui/hooks";
import { Button } from "client/ui/library/button/button";
import { Frame } from "client/ui/library/frame";
import { Image } from "client/ui/library/image";
import { Text } from "client/ui/library/text";
import { images } from "shared/assets/images";
import { fonts } from "shared/constants/fonts";
import { palette } from "shared/constants/palette";
import { springs } from "shared/constants/springs";

export interface UniformSelectorProps {
	uniform: { uniformType: string; uniformName: string; shirt: number; pants: number };
	previewImage: keyof typeof images.ui.icons;
}

export function UniformSelector({ uniform, previewImage }: UniformSelectorProps) {
	const rem = useRem();

	const selectedUniform = useSelector(selectCharacterOutfit);

	const [effectTransparency, effectTransparencyMotion] = useMotion(1);
	const [selectEffect, selectEffectMotion] = useMotion(1);
	const [selectNegEffect, selectNegEffectMotion] = useMotion(0);

	useEffect(() => {
		if (selectedUniform === uniform) {
			effectTransparencyMotion.spring(0.4, springs.responsive);
			selectEffectMotion.spring(0, springs.responsive);
			selectNegEffectMotion.spring(1, springs.responsive);
		} else {
			effectTransparencyMotion.spring(1, springs.responsive);
			selectEffectMotion.spring(1, springs.responsive);
			selectNegEffectMotion.spring(0, springs.responsive);
		}
	}, [selectedUniform]);

	return (
		<>
			<Button
				backgroundTransparency={1}
				event={{
					MouseButton1Click: () => {
						clientStore.setCharacterOutfit(uniform);
					},
					MouseEnter: () => {
						if (selectedUniform.shirt !== uniform.shirt && selectedUniform.pants !== uniform.pants) {
							effectTransparencyMotion.spring(0.5, springs.responsive);
						}
					},
					MouseLeave: () => {
						if (selectedUniform.shirt !== uniform.shirt && selectedUniform.pants !== uniform.pants) {
							effectTransparencyMotion.spring(1, springs.responsive);
						}
					},
				}}
			>
				<uistroke
					Color={Color3.fromRGB(255, 255, 255)}
					ApplyStrokeMode={Enum.ApplyStrokeMode.Border}
					Transparency={0.5}
				/>

				<Frame size={new UDim2(1, 0, 1, -rem(3))} backgroundTransparency={1}>
					<Image
						size={UDim2.fromScale(1, 1)}
						scaleType="Stretch"
						image={images.ui.misc.selectionbackground}
						imageTransparency={effectTransparency}
					/>
					{/* <ViewportFrame /> */}
					<Image
						size={UDim2.fromScale(1, 1)}
						scaleType="Fit"
						image={`rbxthumb://type=Asset&id=${uniform.shirt}&w=150&h=150`}
					/>
				</Frame>

				<Frame
					backgroundColor={palette.surface1}
					size={new UDim2(1, 0, 0, rem(3))}
					position={new UDim2(0, 0, 1, -rem(3))}
				>
					<Image
						position={UDim2.fromOffset(rem(2.5), rem(0))}
						size={UDim2.fromScale(1, 1)}
						imageTransparency={selectNegEffect}
						image={images.ui.icons.down}
					>
						<uiaspectratioconstraint AspectRatio={1} />
					</Image>
					<Image
						position={UDim2.fromOffset(rem(2.5), rem(0))}
						size={UDim2.fromScale(1, 1)}
						image={images.ui.icons.downselectedwhite}
						imageTransparency={selectEffect}
						zIndex={2}
					>
						<uiaspectratioconstraint AspectRatio={1} />
					</Image>
					<Text
						position={UDim2.fromOffset(rem(6), rem(0.5))}
						textXAlignment="Left"
						textAutoResize="XY"
						text={uniform.uniformType.upper()}
						textColor={Color3.fromRGB(124, 128, 131)}
						textSize={rem(0.75)}
						font={fonts.arimo.regular}
					/>
					<Text
						position={UDim2.fromOffset(rem(6), rem(1))}
						textXAlignment="Left"
						textAutoResize="XY"
						text={uniform.uniformName.upper()}
						textColor={Color3.fromRGB(124, 128, 131)}
						textSize={rem(1.5)}
						font={fonts.arimo.regular}
					/>
				</Frame>
			</Button>
		</>
	);
}
