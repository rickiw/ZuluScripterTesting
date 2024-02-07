import Roact from "@rbxts/roact";
import { Button } from "client/ui/library/button/button";
import { Image } from "client/ui/library/image";
import { Text } from "client/ui/library/text";

export interface GunButtonProps {
	name: string;
	previewImage: string;
}

export function CustomizationButton(props: GunButtonProps) {
	return (
		<Button
			cornerRadius={new UDim(0, 8)}
			size={UDim2.fromScale(0.95, 0.8)}
			backgroundColor={Color3.fromRGB(52, 52, 52)}
		>
			<Image
				image={props.previewImage}
				backgroundTransparency={1}
				position={UDim2.fromScale(0.44, 0.1)}
				size={UDim2.fromScale(0.47, 0.8)}
			/>

			<Text
				text={props.name.upper()}
				size={UDim2.fromScale(0.43, 0.4)}
				anchorPoint={new Vector2(0, 0.5)}
				backgroundTransparency={1}
				font={new Font("Highway Gothic", Enum.FontWeight.ExtraBold)}
				textColor={Color3.fromRGB(255, 255, 255)}
				position={UDim2.fromScale(0.01, 0.5)}
				textXAlignment={"Left"}
				textScaled={true}
			/>
		</Button>
	);
}
