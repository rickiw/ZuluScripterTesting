import Roact from "@rbxts/roact";
import { useRem } from "client/ui/hooks";
import { Button } from "../button/button";

interface SmallButtonProps {
	text: string;
	onClick: () => void;
}

export function SmallButton(props: SmallButtonProps) {
	const rem = useRem();

	return (
		<Button
			text={props.text}
			backgroundTransparency={1}
			textColor={Color3.fromRGB(255, 255, 255)}
			fontFace={Font.fromEnum(Enum.Font.Highway)}
			textSize={rem(1.5)}
			event={{
				MouseButton1Click: () => {
					props.onClick();
				},
			}}
		/>
	);
}
