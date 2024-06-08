import { useSelector } from "@rbxts/react-reflex";
import Roact, { useEffect } from "@rbxts/roact";
import { clientStore } from "client/store";
import { UniformBase, selectSelectedUniform } from "client/store/wardrobe";
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
	uniform: UniformBase;
	previewImage: keyof typeof images.ui.icons;
}

export function UniformSelector({ uniform, previewImage }: UniformSelectorProps) {
	const rem = useRem();

	const selectedUniform = useSelector(selectSelectedUniform);

	const [effectTransparency, effectTransparencyMotion] = useMotion(1);

	useEffect(() => {
		if (selectedUniform === uniform) {
			effectTransparencyMotion.spring(0.4, springs.responsive);
		} else {
			effectTransparencyMotion.spring(1, springs.responsive);
		}
	}, [selectedUniform]);

	return (
		<>
			<Button
				backgroundTransparency={1}
				event={{
					MouseButton1Click: () => {
						clientStore.setSelectedUniform(selectedUniform === uniform ? undefined : uniform);
					},
					MouseEnter: () => {
						if (selectedUniform !== uniform) {
							effectTransparencyMotion.spring(0.5, springs.responsive);
						}
					},
					MouseLeave: () => {
						if (selectedUniform !== uniform) {
							effectTransparencyMotion.spring(1, springs.responsive);
						}
					},
				}}
			>
				<uistroke Color={palette.surface1} ApplyStrokeMode={Enum.ApplyStrokeMode.Border} Transparency={0.5} />

				<Frame size={new UDim2(1, 0, 0, rem(3))} backgroundTransparency={effectTransparency} zIndex={3}>
					<uigradient
						Transparency={
							new NumberSequence([
								new NumberSequenceKeypoint(0, 0),
								new NumberSequenceKeypoint(0.6, 0.5),
								new NumberSequenceKeypoint(1, 1),
							])
						}
						Color={
							new ColorSequence([
								new ColorSequenceKeypoint(0, Color3.fromRGB(162, 175, 65)),
								new ColorSequenceKeypoint(0.4, Color3.fromRGB(202, 205, 95)),
								new ColorSequenceKeypoint(1, Color3.fromRGB(255, 255, 255)),
							])
						}
						Rotation={88}
					/>
				</Frame>

				<Frame size={new UDim2(1, 0, 1, -rem(3))} backgroundTransparency={1}>
					<uipadding
						PaddingBottom={new UDim(0, rem(1))}
						PaddingLeft={new UDim(0, rem(1))}
						PaddingRight={new UDim(0, rem(1))}
						PaddingTop={new UDim(0, rem(1))}
					/>
					{/* <ViewportFrame /> */}
					<Image size={UDim2.fromScale(1, 1)} scaleType="Fit" image={images.ui.icons[previewImage]} />
				</Frame>

				<Frame
					backgroundColor={palette.surface1}
					size={new UDim2(1, 0, 0, rem(3))}
					position={new UDim2(0, 0, 1, -rem(3))}
				>
					<Image
						position={UDim2.fromOffset(rem(2.5), rem(0))}
						size={UDim2.fromScale(1, 1)}
						image={selectedUniform === uniform ? images.ui.icons.downselected : images.ui.icons.down}
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
