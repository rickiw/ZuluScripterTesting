import { useSelector } from "@rbxts/react-reflex";
import Roact from "@rbxts/roact";
import { selectEquippedWeaponInfo } from "client/store/inventory";
import { useRem } from "client/ui/hooks";
import { Frame } from "client/ui/library/frame";
import { Text } from "client/ui/library/text";
import { fonts } from "shared/constants/fonts";

export function WeaponInfo() {
	const rem = useRem();

	const equippedWeaponInfo = useSelector(selectEquippedWeaponInfo);

	return (
		<>
			{equippedWeaponInfo && (
				<Frame
					backgroundColor={Color3.fromRGB(23, 16, 18)}
					position={new UDim2(0, rem(1), 1, -rem(10))}
					size={UDim2.fromOffset(rem(12), rem(3.5))}
					backgroundTransparency={0.5}
				>
					<uicorner CornerRadius={new UDim(0, rem(1))} />
					<Frame
						anchorPoint={new Vector2(0.5, 0.5)}
						backgroundColor={Color3.fromRGB(255, 255, 255)}
						backgroundTransparency={0.5}
						position={new UDim2(0, rem(1.5), 0.5, 0)}
						size={UDim2.fromOffset(rem(0.25), rem(2.5))}
					/>

					<Text
						text={equippedWeaponInfo.weaponName}
						anchorPoint={new Vector2(0, 0.5)}
						textColor={Color3.fromRGB(255, 255, 255)}
						textSize={rem(1.35)}
						textXAlignment="Center"
						position={UDim2.fromOffset(rem(2.5), rem(1))}
						size={UDim2.fromOffset(rem(7.5), rem(2))}
						font={fonts.inter.bold}
						textTransparency={0.5}
					/>

					<Text
						text={`${equippedWeaponInfo.ammo} | ${equippedWeaponInfo.reserve}`}
						anchorPoint={new Vector2(0, 0.5)}
						textColor={Color3.fromRGB(255, 255, 255)}
						textSize={rem(1.5)}
						textXAlignment="Center"
						position={UDim2.fromOffset(rem(2.5), rem(2.5))}
						size={UDim2.fromOffset(rem(7.5), rem(2))}
						font={fonts.inter.extra}
						textTransparency={0.5}
					/>
				</Frame>
			)}
		</>
	);
}
