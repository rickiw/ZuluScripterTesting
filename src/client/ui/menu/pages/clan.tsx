import Roact from "@rbxts/roact";
import { useRem } from "client/ui/hooks";
import { Frame } from "client/ui/library/frame";
import { Text } from "client/ui/library/text";
import { fonts } from "shared/constants/fonts";
import { SideInformation } from "../side-information";

export function ClanPage() {
	const rem = useRem();

	return (
		<>
			<SideInformation />
			<Frame
				key="item-info"
				backgroundTransparency={0.6}
				borderColor={Color3.fromRGB(255, 255, 255)}
				borderSize={1}
				backgroundColor={Color3.fromRGB(0, 0, 0)}
				position={UDim2.fromOffset(rem(26), rem(7.5))}
				size={UDim2.fromOffset(rem(65), rem(5))}
			>
				<Text
					text="CLAN SEARCH"
					textColor={Color3.fromRGB(255, 255, 255)}
					font={fonts.gothic.regular}
					textSize={rem(3)}
					textYAlignment="Center"
					size={UDim2.fromScale(1, 1)}
				/>
			</Frame>
			<scrollingframe
				key="items"
				Position={UDim2.fromOffset(rem(26), rem(12.5))}
				Size={UDim2.fromOffset(rem(65), rem(37.5))}
				BackgroundTransparency={0.5}
				BackgroundColor3={Color3.fromRGB(0, 0, 0)}
				BorderSizePixel={1}
				BorderColor3={Color3.fromRGB(255, 255, 255)}
				ScrollBarThickness={7}
				VerticalScrollBarPosition={Enum.VerticalScrollBarPosition.Left}
			></scrollingframe>
			<Frame
				key="item-info"
				backgroundTransparency={0.6}
				backgroundColor={Color3.fromRGB(0, 0, 0)}
				position={UDim2.fromOffset(rem(91), rem(7.5))}
				size={UDim2.fromOffset(rem(25), rem(42.5))}
			>
				<Text
					text=""
					borderSize={1}
					borderColor={Color3.fromRGB(255, 255, 255)}
					backgroundTransparency={0.7}
					backgroundColor={Color3.fromRGB(0, 0, 0)}
					size={UDim2.fromOffset(rem(25), rem(5))}
				/>
				<Text
					text={"INFORMATION"}
					textColor={Color3.fromRGB(255, 255, 255)}
					font={fonts.gothic.regular}
					textSize={rem(2.5)}
					textYAlignment="Center"
					size={UDim2.fromOffset(rem(25), rem(5))}
				/>
				<Frame
					key="item-description"
					backgroundTransparency={0.7}
					backgroundColor={Color3.fromRGB(0, 0, 0)}
					borderColor={Color3.fromRGB(255, 255, 255)}
					borderSize={1}
					position={UDim2.fromOffset(rem(0), rem(5))}
					size={UDim2.fromOffset(rem(25), rem(37.5))}
				>
					<Text
						text={""}
						textWrapped={true}
						textTruncate="AtEnd"
						textColor={Color3.fromRGB(255, 255, 255)}
						font={fonts.gothic.regular}
						textSize={16}
						size={UDim2.fromOffset(rem(25), rem(35))}
						textYAlignment="Top"
						textXAlignment="Left"
					/>
					<Frame
						key="purchase"
						backgroundTransparency={0.6}
						backgroundColor={Color3.fromRGB(0, 0, 0)}
						borderColor={Color3.fromRGB(255, 255, 255)}
						borderSize={1}
						position={UDim2.fromOffset(rem(7.5), rem(32.5))}
						size={UDim2.fromOffset(rem(10), rem(3))}
					>
						<textbutton
							BackgroundTransparency={1}
							Size={UDim2.fromScale(1, 1)}
							Text="JOIN"
							TextColor3={Color3.fromRGB(255, 255, 255)}
							FontFace={fonts.gothic.bold}
							TextScaled={false}
							TextSize={rem(1.5)}
							Event={{
								MouseButton1Down: () => {},
							}}
						/>
					</Frame>
					<Text
						text={"JOIN REQUESTED"}
						textColor={Color3.fromRGB(255, 255, 255)}
						font={fonts.gothic.regular}
						textSize={rem(1)}
						position={UDim2.fromOffset(rem(0), rem(34.75))}
						textYAlignment="Center"
						size={UDim2.fromScale(1, 0.1)}
					/>
				</Frame>
			</Frame>
		</>
	);
}
