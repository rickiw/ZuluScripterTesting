import Roact, { useContext } from "@rbxts/roact";
import { Button } from "client/ui/library/button/button";
import { Image } from "client/ui/library/image";
import { Text } from "client/ui/library/text";
import { SelectedWeaponContext } from "../context/customization";
import { useRem } from "../hooks";

export interface GunButtonProps {
	name: string;
	previewImage: string;
	setContext?: boolean;
}

export function CustomizationButton(props: GunButtonProps) {
	const rem = useRem();

	const [selectedWeapon, setSelectedWeapon] = useContext(SelectedWeaponContext);

	return (
		<Button
			cornerRadius={new UDim(0, 8)}
			backgroundColor={Color3.fromRGB(52, 52, 52)}
			event={{
				MouseButton1Click: () => {
					if (props.setContext) {
						setSelectedWeapon(props.name);
					}
				},
			}}
		>
			<Image
				image={props.previewImage}
				backgroundTransparency={1}
				position={UDim2.fromOffset(rem(25), rem(1))}
				size={UDim2.fromOffset(rem(5), rem(5))}
			/>

			<Text
				text={props.name.upper()}
				size={UDim2.fromOffset(rem(20), rem(5))}
				backgroundTransparency={1}
				font={new Font("Highway Gothic", Enum.FontWeight.ExtraBold)}
				textColor={Color3.fromRGB(255, 255, 255)}
				position={UDim2.fromOffset(rem(1), rem(1.25))}
				textXAlignment={"Left"}
				textSize={rem(3)}
			/>
		</Button>
	);
}
