import Roact from "@rbxts/roact";
import { useMotion, useRem } from "client/ui/hooks";
import { Button } from "client/ui/library/button/button";
import { Frame } from "client/ui/library/frame";
import { Image } from "client/ui/library/image";
import { images } from "shared/assets/images";
import { palette } from "shared/constants/palette";
import { springs } from "shared/constants/springs";

export interface WeaponSelectorProps {
	color: Color3;
	previewImage?: keyof typeof images.ui.icons;
	layoutOrder?: number;
}

export function ColorSelector({ color, previewImage, layoutOrder }: WeaponSelectorProps) {
	const rem = useRem();
	const [effectTransparency, effectTransparencyMotion] = useMotion(1);

	return (
		<>
			<Button
				layoutOrder={layoutOrder}
				backgroundTransparency={1}
				event={{
					MouseButton1Click: () => {},
					MouseEnter: () => {
						effectTransparencyMotion.spring(0.5, springs.responsive);
					},
					MouseLeave: () => {
						effectTransparencyMotion.spring(1, springs.responsive);
					},
				}}
			>
				<uistroke Color={palette.surface1} ApplyStrokeMode={Enum.ApplyStrokeMode.Border} Transparency={0.5} />
				<uiaspectratioconstraint AspectRatio={1} />

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
					{previewImage ? (
						<Image size={UDim2.fromScale(1, 1)} scaleType="Fit" image={images.ui.icons[previewImage]} />
					) : (
						<></>
					)}
				</Frame>

				<Frame
					backgroundColor={color}
					size={new UDim2(1, 0, 0, rem(1.5))}
					position={new UDim2(0, 0, 1, -rem(1.5))}
				></Frame>
			</Button>
		</>
	);
}
