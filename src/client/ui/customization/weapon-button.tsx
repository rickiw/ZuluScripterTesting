import { useSelector } from "@rbxts/react-reflex";
import Roact from "@rbxts/roact";
import { clientStore } from "client/store";
import { selectSelectedWeapon } from "client/store/customization";
import { selectIsHoldingItemByName } from "client/store/inventory";
import { Button } from "client/ui/library/button/button";
import { Image } from "client/ui/library/image";
import { Text } from "client/ui/library/text";
import { WeaponBase } from "shared/constants/weapons";
import { useRem } from "../hooks";
import { Frame } from "../library/frame";

export interface WeaponButtonProps {
	weapon: WeaponBase;
	previewImage: string;
}

export function WeaponButton(props: WeaponButtonProps) {
	const rem = useRem();

	const selectedWeapon = useSelector(selectSelectedWeapon);
	const activeWeapon = useSelector(selectIsHoldingItemByName(props.weapon.baseTool.Name));

	return (
		<Button
			cornerRadius={new UDim(0, 8)}
			backgroundColor={Color3.fromRGB(52, 52, 52)}
			event={{
				MouseButton1Click: () => {
					if (selectedWeapon !== props.weapon) {
						clientStore.clearModificationPreviews();
					}
					clientStore.setSelectedWeapon(selectedWeapon === props.weapon ? undefined : props.weapon);
					if (selectedWeapon === props.weapon) {
						clientStore.setSelectedModification(undefined);
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
				text={props.weapon.weaponType ?? "Unknown"}
				size={UDim2.fromOffset(rem(20), rem(5))}
				backgroundTransparency={1}
				font={new Font("Highway Gothic", Enum.FontWeight.SemiBold)}
				textColor={Color3.fromRGB(155, 155, 155)}
				position={UDim2.fromOffset(rem(1), rem(-1))}
				textXAlignment={"Left"}
				textSize={rem(2)}
			/>

			<Text
				text={props.weapon.baseTool.Name.upper()}
				size={UDim2.fromOffset(rem(20), rem(5))}
				backgroundTransparency={1}
				font={new Font("Highway Gothic", Enum.FontWeight.ExtraBold)}
				textColor={Color3.fromRGB(255, 255, 255)}
				position={UDim2.fromOffset(rem(1), rem(1.25))}
				textXAlignment={"Left"}
				textSize={rem(2.5)}
			/>

			{activeWeapon && (
				<>
					<Text
						text={"EQUIPPED"}
						size={UDim2.fromOffset(rem(20), rem(5))}
						backgroundTransparency={1}
						font={new Font("Highway Gothic", Enum.FontWeight.SemiBold)}
						textColor={Color3.fromRGB(155, 155, 155)}
						position={UDim2.fromOffset(rem(1), rem(3.5))}
						textXAlignment={"Left"}
						textSize={rem(1.5)}
					/>

					<Frame
						size={UDim2.fromOffset(15, 15)}
						backgroundColor={Color3.fromRGB(155, 155, 155)}
						position={UDim2.fromOffset(rem(7), rem(5.5))}
					>
						<uicorner CornerRadius={new UDim(1, 0)} />
					</Frame>
				</>
			)}
		</Button>
	);
}
