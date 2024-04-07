import Roact from "@rbxts/roact";
import { useRem } from "../hooks";
import { Button } from "../library/button/button";

export interface MenuButtonProps {
	text: string;
	size?: UDim2;
	position: UDim2;
	clicked?: () => void;
}

export function StyledMenuButton({ text, size, position, clicked }: MenuButtonProps) {
	const rem = useRem();

	return (
		<>
			<Button
				text={text}
				position={position}
				backgroundTransparency={0}
				backgroundColor={Color3.fromRGB(0, 0, 0)}
				borderColor={Color3.fromRGB(255, 255, 255)}
				borderSize={1}
				textColor={Color3.fromRGB(255, 255, 255)}
				fontFace={Font.fromEnum(Enum.Font.Highway)}
				textSize={rem(2)}
				size={size ?? UDim2.fromOffset(rem(12.5), rem(2.5))}
				event={{
					MouseButton1Click: () => {
						if (clicked) {
							clicked();
						}
					},
				}}
			/>
		</>
	);
}
