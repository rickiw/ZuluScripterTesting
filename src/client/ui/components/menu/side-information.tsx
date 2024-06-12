import { useSelector } from "@rbxts/react-reflex";
import Roact from "@rbxts/roact";
import { selectMenuOpen, selectPlayerSave } from "client/store/menu";
import { selectHealth, selectStamina } from "client/store/vitals";

import { useRem } from "client/ui/hooks";
import { fonts } from "shared/constants/fonts";
import { Frame } from "../../library/frame";
import { Text } from "../../library/text";

export function SideInformation() {
	const rem = useRem();

	const playerSave = useSelector(selectPlayerSave);
	const stamina = useSelector(selectStamina);
	const health = useSelector(selectHealth);
	const menuOpen = useSelector(selectMenuOpen);

	return (
		<Frame
			position={UDim2.fromOffset(rem(1), rem(7.5))}
			size={UDim2.fromOffset(rem(25), rem(42.5))}
			backgroundTransparency={0.6}
			backgroundColor={Color3.fromRGB(0, 0, 0)}
		>
			<uigradient
				Color={new ColorSequence(Color3.fromRGB(255, 255, 255))}
				Offset={new Vector2(0, 0)}
				Rotation={0}
				Transparency={new NumberSequence([new NumberSequenceKeypoint(0, 1), new NumberSequenceKeypoint(1, 0)])}
			/>
			<Text
				text="STATISTICS"
				anchorPoint={new Vector2(0.5, 0.5)}
				position={UDim2.fromOffset(rem(12.5), rem(2.5))}
				size={UDim2.fromOffset(rem(20), rem(5))}
				textColor={Color3.fromRGB(255, 255, 255)}
				font={fonts.gothic.bold}
				textSize={rem(3)}
				textXAlignment="Right"
				textYAlignment="Center"
			/>
			<Frame
				key="xp-info"
				position={UDim2.fromOffset(rem(10), rem(7.5))}
				size={UDim2.fromOffset(rem(12.5), rem(10))}
				backgroundTransparency={1}
			>
				<uigridlayout
					CellSize={UDim2.fromOffset(rem(2), rem(1))}
					CellPadding={UDim2.fromOffset(rem(1), rem(1))}
					HorizontalAlignment={Enum.HorizontalAlignment.Right}
					FillDirection={Enum.FillDirection.Vertical}
				/>
				<Text
					text="XP"
					textColor={Color3.fromRGB(255, 255, 255)}
					font={fonts.gothic.regular}
					textSize={rem(2.5)}
					textXAlignment="Right"
				/>
				<Text
					text={playerSave ? tostring(playerSave.experience) : "XXX"}
					textColor={Color3.fromRGB(135, 189, 255)}
					font={fonts.gothic.regular}
					textSize={rem(2.25)}
					textXAlignment="Right"
				/>
			</Frame>
			<Frame
				key="credit-info"
				position={UDim2.fromOffset(rem(10), rem(12.5))}
				size={UDim2.fromOffset(rem(12.5), rem(10))}
				backgroundTransparency={1}
			>
				<uigridlayout
					CellSize={UDim2.fromOffset(rem(2), rem(1))}
					CellPadding={UDim2.fromOffset(rem(1), rem(1))}
					HorizontalAlignment={Enum.HorizontalAlignment.Right}
					FillDirection={Enum.FillDirection.Vertical}
				/>
				<Text
					text="CREDITS"
					textColor={Color3.fromRGB(255, 255, 255)}
					font={fonts.gothic.regular}
					textSize={rem(2.5)}
					textXAlignment="Right"
				/>
				<Text
					text={playerSave ? tostring(playerSave.credits) : "XXX"}
					textColor={Color3.fromRGB(255, 179, 1)}
					font={fonts.gothic.regular}
					textSize={rem(2.25)}
					textXAlignment="Right"
				/>
			</Frame>
		</Frame>
	);
}
