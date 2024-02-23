import { useSelector } from "@rbxts/react-reflex";
import Roact from "@rbxts/roact";
import { selectMenuOpen, selectPlayerSave } from "client/store/menu";
import { selectHealth, selectStamina } from "client/store/vitals";

import { fonts } from "shared/constants/fonts";
import { Frame } from "../frame";
import { Text } from "../text";

export function SideInformation() {
	const playerSave = useSelector(selectPlayerSave);
	const stamina = useSelector(selectStamina);
	const health = useSelector(selectHealth);
	const menuOpen = useSelector(selectMenuOpen);

	return (
		<Frame
			position={UDim2.fromScale(0.019, 0.14)}
			size={UDim2.fromScale(0.2, 0.825)}
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
				position={UDim2.fromScale(0.7, 0.05)}
				size={UDim2.fromScale(0.5, 0.05)}
				textColor={Color3.fromRGB(255, 255, 255)}
				font={fonts.gothic.bold}
				textSize={24}
				textXAlignment="Right"
				textYAlignment="Center"
			/>
			<Frame
				key="xp-info"
				position={UDim2.fromScale(0.4, 0.139)}
				size={UDim2.fromScale(0.5, 0.1)}
				backgroundTransparency={1}
			>
				<uigridlayout
					CellSize={UDim2.fromOffset(80, 10)}
					CellPadding={UDim2.fromOffset(5, 5)}
					HorizontalAlignment={Enum.HorizontalAlignment.Right}
					FillDirection={Enum.FillDirection.Vertical}
				/>
				<Text
					text="XP"
					textColor={Color3.fromRGB(255, 255, 255)}
					font={fonts.gothic.regular}
					textXAlignment="Right"
				/>
				<Text
					text={playerSave ? tostring(playerSave.experience) : "XXX"}
					textColor={Color3.fromRGB(135, 189, 255)}
					font={fonts.gothic.regular}
					textXAlignment="Right"
				/>
			</Frame>
			<Frame
				key="credit-info"
				position={UDim2.fromScale(0.4, 0.275)}
				size={UDim2.fromScale(0.5, 0.1)}
				backgroundTransparency={1}
			>
				<uigridlayout
					CellSize={UDim2.fromOffset(80, 10)}
					CellPadding={UDim2.fromOffset(5, 5)}
					HorizontalAlignment={Enum.HorizontalAlignment.Right}
					FillDirection={Enum.FillDirection.Vertical}
				/>
				<Text
					text="CREDITS"
					textColor={Color3.fromRGB(255, 255, 255)}
					font={fonts.gothic.regular}
					textXAlignment="Right"
				/>
				<Text
					text={playerSave ? tostring(playerSave.credits) : "XXX"}
					textColor={Color3.fromRGB(255, 179, 1)}
					font={fonts.gothic.regular}
					textXAlignment="Right"
				/>
			</Frame>
			<Frame
				key="booster-info"
				position={UDim2.fromScale(0.4, 0.716)}
				size={UDim2.fromScale(0.5, 0.1)}
				backgroundTransparency={1}
			>
				<uigridlayout
					CellSize={UDim2.fromOffset(80, 10)}
					CellPadding={UDim2.fromOffset(5, 5)}
					FillDirectionMaxCells={0}
					HorizontalAlignment={Enum.HorizontalAlignment.Right}
					FillDirection={Enum.FillDirection.Horizontal}
				/>
				<Text
					text="BOOSTERS"
					textColor={Color3.fromRGB(255, 255, 255)}
					font={fonts.gothic.regular}
					textXAlignment="Right"
				/>
				<Text
					text={`${playerSave ? tostring(playerSave.credits) : "XXX"} CREDITS`}
					textColor={Color3.fromRGB(255, 255, 255)}
					font={fonts.gothic.regular}
					textXAlignment="Right"
				/>
				<Text
					text={`${menuOpen} ${health ?? "XX"}% HEALTH`}
					textColor={Color3.fromRGB(255, 255, 255)}
					font={fonts.gothic.regular}
					textXAlignment="Right"
				/>
				<Text
					text={`${stamina.value * 100 ?? "XX"}% STAMINA`}
					textColor={Color3.fromRGB(255, 255, 255)}
					font={fonts.gothic.regular}
					textXAlignment="Right"
				/>
			</Frame>
		</Frame>
	);
}
