import { useSelector } from "@rbxts/react-reflex";
import Roact, { useEffect, useState } from "@rbxts/roact";
import { clientStore } from "client/store";
import { selectSelectedCustomizationPage } from "client/store/customization";
import { useMotion, useRem } from "client/ui/hooks";
import { Button } from "client/ui/library/button/button";
import { Frame } from "client/ui/library/frame";
import { Image } from "client/ui/library/image";
import { Text } from "client/ui/library/text";
import { images } from "shared/assets/images";
import { fonts } from "shared/constants/fonts";
import { springs } from "shared/constants/springs";

interface ButtonRowButtonProps {
	title: string;
	page: "character" | "teams" | "uniform" | "other";
	icon: keyof typeof images.ui.icons;
	selectedIcon?: keyof typeof images.ui.icons;
}

export function ButtonRowButton({ title, page, icon, selectedIcon }: ButtonRowButtonProps) {
	const rem = useRem();

	const [hovered, setHovered] = useState(false);
	const [backgroundTransparency, backgroundTransparencyMotion] = useMotion(1);
	const [effectTransparency, effectTransparencyMotion] = useMotion(1);

	const selectedPage = useSelector(selectSelectedCustomizationPage);

	useEffect(() => {
		backgroundTransparencyMotion.spring(hovered ? 0.75 : 1, springs.gentle);
		effectTransparencyMotion.spring(hovered ? 0 : 1, springs.gentle);
	}, [hovered]);

	return (
		<>
			<Button
				backgroundColor={Color3.fromRGB(143, 149, 111)}
				backgroundTransparency={selectedPage === page ? 0.75 : backgroundTransparency}
				event={{
					MouseEnter: () => setHovered(true),
					MouseLeave: () => setHovered(false),
					MouseButton1Click: () => {
						clientStore.setCustomizationSelectedPage(page);
					},
				}}
			>
				<Frame
					backgroundTransparency={selectedPage === page ? 0 : effectTransparency}
					backgroundColor={Color3.fromRGB(143, 149, 111)}
					size={UDim2.fromScale(0.1, 1)}
					position={UDim2.fromScale(0, 0)}
				/>
				<Frame
					backgroundTransparency={selectedPage === page ? 0 : effectTransparency}
					backgroundColor={Color3.fromRGB(143, 149, 111)}
					size={UDim2.fromScale(0.1, 1)}
					position={UDim2.fromScale(0.9, 0)}
				/>
				{selectedPage === page && (
					<>
						<Image
							anchorPoint={new Vector2(0.5, 0.5)}
							size={UDim2.fromOffset(rem(1.5), rem(1.5))}
							scaleType="Fit"
							position={UDim2.fromScale(0.5, 0.95)}
							image={images.ui.icons.toparrow}
						/>
						<Frame
							size={new UDim2(1.15, 0, 0, rem(2))}
							position={UDim2.fromScale(0, 1)}
							backgroundColor={Color3.fromRGB(61, 65, 42)}
							backgroundTransparency={selectedPage === page ? 0 : effectTransparency}
						>
							<Text
								size={UDim2.fromScale(0.75, 1)}
								text={title.split(" ")[0]}
								textSize={rem(1.15)}
								textXAlignment="Center"
								textColor={Color3.fromRGB(106, 109, 81)}
								font={fonts.inter.bold}
								textTransparency={selectedPage === page ? 0 : effectTransparency}
							/>
							<Text
								size={UDim2.fromScale(0.25, 1)}
								position={UDim2.fromScale(0.75, 0)}
								text={title.split(" ")[1] ?? "N/A"}
								textXAlignment="Right"
								textSize={rem(1.15)}
								textColor={Color3.fromRGB(106, 109, 81)}
								borderSize={0}
								zIndex={3}
								font={fonts.inter.bold}
								textTransparency={selectedPage === page ? 0 : effectTransparency}
							/>
						</Frame>
					</>
				)}

				<Image
					anchorPoint={new Vector2(0.5, 0.5)}
					size={UDim2.fromOffset(rem(2.5), rem(2.5))}
					position={UDim2.fromScale(0.5, 0.5)}
					image={
						!selectedIcon
							? images.ui.icons[icon]
							: selectedPage === page || hovered
								? images.ui.icons[selectedIcon]
								: images.ui.icons[icon]
					}
				/>
			</Button>
		</>
	);
}
