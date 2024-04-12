import { useSelector } from "@rbxts/react-reflex";
import Roact, { useEffect, useState } from "@rbxts/roact";
import { clientStore } from "client/store";
import { selectSelectedCustomizationPage } from "client/store/customization";
import { useMotion, useRem } from "client/ui/hooks";
import { Button } from "client/ui/library/button/button";
import { Frame } from "client/ui/library/frame";
import { Image } from "client/ui/library/image";
import { Text } from "client/ui/library/text";
import { fonts } from "shared/constants/fonts";
import { springs } from "shared/constants/springs";

interface ButtonRowButtonProps {
	title: string;
	page: "character" | "teams" | "uniform" | "other";
	icon: string;
}

export function ButtonRowButton({ title, page, icon }: ButtonRowButtonProps) {
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
					size={UDim2.fromScale(0.1, 0.95)}
					position={UDim2.fromScale(0, 0)}
				/>
				<Frame
					backgroundTransparency={selectedPage === page ? 0 : effectTransparency}
					backgroundColor={Color3.fromRGB(143, 149, 111)}
					size={UDim2.fromScale(0.1, 0.95)}
					position={UDim2.fromScale(0.9, 0)}
				/>
				<Text
					size={new UDim2(1, 0, 0, rem(2))}
					position={UDim2.fromScale(0, 0.95)}
					text={title}
					textSize={rem(1)}
					backgroundColor={Color3.fromRGB(143, 149, 111)}
					borderSize={0}
					font={fonts.inter.medium}
					textTransparency={selectedPage === page ? 0 : effectTransparency}
					backgroundTransparency={selectedPage === page ? 0 : effectTransparency}
				/>
				<Image
					anchorPoint={new Vector2(0.5, 0.5)}
					size={UDim2.fromOffset(rem(2.5), rem(2.5))}
					position={UDim2.fromScale(0.5, 0.5)}
					imageColor={selectedPage === page ? Color3.fromRGB(222, 242, 115) : Color3.fromRGB(255, 255, 255)}
					image={icon}
				/>
			</Button>
		</>
	);
}
