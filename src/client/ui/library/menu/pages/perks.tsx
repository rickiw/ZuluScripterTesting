import { useSelector } from "@rbxts/react-reflex";
import Roact from "@rbxts/roact";
import { clientStore } from "client/store";
import { Perk, selectActivePerk, selectPerks } from "client/store/perks";
import { fonts } from "shared/constants/fonts";
import { Frame } from "../../frame";
import { Text } from "../../text";
import { SideInformation } from "../side-information";

function Perk(props: { perk: Perk }) {
	const { title, displayImage, color } = props.perk;
	return (
		<imagebutton
			key={title}
			Image={displayImage}
			Event={{
				MouseButton1Click: () => {
					clientStore.setSelectedPerk(props.perk);
				},
			}}
		>
			<Frame
				backgroundColor={Color3.fromRGB(255, 255, 255)}
				size={UDim2.fromScale(1, 1)}
				anchorPoint={new Vector2(0.5, 0.5)}
				position={UDim2.fromScale(0.5, 0.5)}
			>
				<uigradient
					Color={new ColorSequence(color)}
					Transparency={
						new NumberSequence([
							new NumberSequenceKeypoint(0, 1),
							new NumberSequenceKeypoint(0.518, 1),
							new NumberSequenceKeypoint(1, 0),
						])
					}
					Rotation={90}
				/>
			</Frame>
		</imagebutton>
	);
}

export function PerksPage() {
	const perks = useSelector(selectPerks);
	const selectedPerk = useSelector(selectActivePerk);

	return (
		<>
			<SideInformation />
			<scrollingframe
				key="objectives"
				Position={UDim2.fromScale(0.22, 0.14)}
				Size={UDim2.fromScale(0.5, 0.825)}
				BackgroundTransparency={0.5}
				BackgroundColor3={Color3.fromRGB(0, 0, 0)}
				BorderSizePixel={1}
				BorderColor3={Color3.fromRGB(255, 255, 255)}
				ScrollBarThickness={7}
				ScrollingDirection={Enum.ScrollingDirection.X}
				VerticalScrollBarPosition={Enum.VerticalScrollBarPosition.Right}
			>
				<uigridlayout
					FillDirectionMaxCells={0}
					FillDirection={Enum.FillDirection.Horizontal}
					HorizontalAlignment={Enum.HorizontalAlignment.Left}
					SortOrder={Enum.SortOrder.LayoutOrder}
					StartCorner={Enum.StartCorner.TopLeft}
					VerticalAlignment={Enum.VerticalAlignment.Top}
					CellSize={UDim2.fromScale(0.25, 0.5)}
					CellPadding={UDim2.fromScale(0.025, 0.01)}
				/>
				{perks.map((perk) => (
					<Perk perk={perk} />
				))}
			</scrollingframe>
			<Frame
				key="objective-info"
				backgroundTransparency={0.6}
				backgroundColor={Color3.fromRGB(0, 0, 0)}
				position={UDim2.fromScale(0.72, 0.14)}
				size={UDim2.fromScale(0.25, 0.825)}
			>
				<Text
					anchorPoint={new Vector2(0.5, 0.5)}
					text=""
					position={UDim2.fromScale(0.5, 0.05)}
					borderSize={1}
					borderColor={Color3.fromRGB(255, 255, 255)}
					backgroundTransparency={0.7}
					backgroundColor={Color3.fromRGB(0, 0, 0)}
					size={UDim2.fromScale(1, 0.1)}
				/>
				<Text
					anchorPoint={new Vector2(0.5, 0.5)}
					text={"INFORMATION"}
					textColor={Color3.fromRGB(255, 255, 255)}
					font={fonts.gothic.regular}
					textSize={16}
					position={UDim2.fromScale(0.5, 0.05)}
					textYAlignment="Center"
					size={UDim2.fromScale(1, 0.1)}
				/>
				<Frame
					key="item-description"
					backgroundTransparency={0.7}
					backgroundColor={Color3.fromRGB(0, 0, 0)}
					borderColor={Color3.fromRGB(255, 255, 255)}
					borderSize={1}
					position={UDim2.fromScale(0, 0.1)}
					size={UDim2.fromScale(1, 0.9)}
				>
					<Text
						anchorPoint={new Vector2(0.5, 0.5)}
						text={""}
						textWrapped={true}
						textTruncate="AtEnd"
						textColor={Color3.fromRGB(255, 255, 255)}
						font={fonts.gothic.regular}
						textSize={16}
						size={UDim2.fromScale(0.95, 0.825)}
						position={UDim2.fromScale(0.5, 0.425)}
						textYAlignment="Top"
						textXAlignment="Left"
					/>
					<Frame
						key="purchase"
						backgroundTransparency={0.6}
						backgroundColor={Color3.fromRGB(0, 0, 0)}
						borderColor={Color3.fromRGB(255, 255, 255)}
						borderSize={1}
						anchorPoint={new Vector2(0.5, 0.5)}
						position={UDim2.fromScale(0.5, 0.9)}
						size={UDim2.fromScale(0.3, 0.075)}
					>
						<textbutton
							BackgroundTransparency={1}
							Size={UDim2.fromScale(1, 1)}
							Text="BUY"
							TextColor3={Color3.fromRGB(255, 255, 255)}
							FontFace={fonts.gothic.bold}
							TextScaled={false}
							TextSize={18}
							Event={{
								MouseButton1Down: () => {},
							}}
						/>
					</Frame>
					<Text
						anchorPoint={new Vector2(0.5, 0.5)}
						text={selectedPerk ? `${selectedPerk.price} CREDITS` : "XXX CREDITS"}
						textColor={Color3.fromRGB(255, 255, 255)}
						font={fonts.gothic.regular}
						textSize={16}
						position={UDim2.fromScale(0.5, 0.965)}
						textYAlignment="Center"
						size={UDim2.fromScale(1, 0.1)}
					/>
				</Frame>
			</Frame>
		</>
	);
}
