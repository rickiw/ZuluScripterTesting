import Roact, { createRef } from "@rbxts/roact";
import { fonts } from "shared/constants/fonts";
import { useRem } from "../hooks";
import { Button } from "../library/button/button";
import { MenuButtonProps } from "./styled-button";

export interface DropdownItem {
	text: string;
	clicked: () => void;
}

export interface StyledDropdownButtonProps extends MenuButtonProps {
	items: DropdownItem[];
	close: () => void;
	open?: boolean;
}

export function StyledDropdownButton({ text, size, position, clicked, items, open, close }: StyledDropdownButtonProps) {
	const rem = useRem();

	const buttonRef = createRef<TextButton>();

	return (
		<>
			<Button
				ref={buttonRef}
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
			{open && (
				<>
					{items.map((item, index) => (
						<Button
							backgroundColor={Color3.fromRGB(255, 255, 255)}
							text={item.text}
							position={UDim2.fromOffset(
								position.X.Offset,
								position.Y.Offset +
									index * rem(2.5) +
									(size ?? UDim2.fromOffset(rem(12.5), rem(2.5))).Y.Offset ?? 0,
							)}
							fontFace={fonts.gothic.regular}
							textSize={rem(2)}
							size={size}
							event={{
								MouseButton1Click: () => {
									item.clicked();
									close();
								},
							}}
						/>
					))}
				</>
			)}
		</>
	);
}
