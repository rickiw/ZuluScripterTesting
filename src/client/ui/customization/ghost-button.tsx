import Roact from "@rbxts/roact";
import { fonts } from "shared/constants/fonts";
import { useRem } from "../hooks";
import { Button } from "../library/button/button";

export interface MenuButtonProps {
	text: string;
	anchorPoint?: Vector2;
	size?: UDim2;
	position: UDim2;
	clicked?: () => void;
}

export function GhostButton({ text, anchorPoint, size, position, clicked }: MenuButtonProps) {
	const rem = useRem();

	return (
		<>
			<Button
				text={text}
				anchorPoint={anchorPoint}
				position={position}
				backgroundTransparency={1}
				backgroundColor={Color3.fromRGB(0, 0, 0)}
				borderColor={Color3.fromRGB(255, 255, 255)}
				borderSize={1}
				textColor={Color3.fromRGB(255, 255, 255)}
				fontFace={fonts.gothic.regular}
				textSize={rem(2)}
				size={size ?? UDim2.fromOffset(rem(12.5), rem(2.5))}
				event={{
					MouseButton1Click: () => {
						if (clicked) {
							clicked();
						}
					},
				}}
			>
				<uistroke Color={Color3.fromRGB(255, 255, 255)} ApplyStrokeMode={Enum.ApplyStrokeMode.Border} />
			</Button>
		</>
	);
}
