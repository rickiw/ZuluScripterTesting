import { lerpBinding } from "@rbxts/pretty-react-hooks";
import { useSelector } from "@rbxts/react-reflex";
import Roact from "@rbxts/roact";
import { clientStore } from "client/store";
import { selectActivePerk, selectPerks } from "client/store/perks";
import { useMotion, useRem } from "client/ui/hooks";
import { Frame } from "client/ui/library/frame";
import { Text } from "client/ui/library/text";
import { fonts } from "shared/constants/fonts";
import { springs } from "shared/constants/springs";
import { PerkInfo } from "shared/store/perks";
import { SideInformation } from "../side-information";

function Perk(props: { perk: PerkInfo }) {
	const rem = useRem();

	const { title, displayImage, color } = props.perk;
	const [hover, hoverMotion] = useMotion(0);

	return (
		<Frame backgroundTransparency={1} size={UDim2.fromScale(1, 1)}>
			<imagebutton
				key={title}
				Image={displayImage}
				Event={{
					MouseButton1Click: () => {
						clientStore.setSelectedPerk(props.perk);
					},
					MouseEnter: () => hoverMotion.spring(1, springs.molasses),
					MouseLeave: () => hoverMotion.spring(0, springs.molasses),
				}}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={UDim2.fromScale(0.5, 0.5)}
				Size={lerpBinding(hover, UDim2.fromScale(1, 1), UDim2.fromScale(0.97, 0.95))}
			>
				<Frame
					backgroundColor={Color3.fromRGB(255, 255, 255)}
					anchorPoint={new Vector2(0.5, 0.5)}
					position={UDim2.fromScale(0.5, 0.5)}
					size={UDim2.fromScale(1, 1)}
					event={{
						MouseEnter: () => hoverMotion.spring(1),
						MouseLeave: () => hoverMotion.spring(0),
					}}
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
		</Frame>
	);
}

export function PerksPage() {
	const rem = useRem();

	const perks = useSelector(selectPerks);
	const selectedPerk = useSelector(selectActivePerk);

	return (
		<>
			<SideInformation />
			<scrollingframe
				key="objectives"
				Position={UDim2.fromOffset(rem(26), rem(7.5))}
				Size={UDim2.fromOffset(rem(65), rem(42.5))}
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
					CellSize={UDim2.fromOffset(rem(12.5), rem(42.5))}
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
						textSize={rem(2)}
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
							Text="BUY"
							TextColor3={Color3.fromRGB(255, 255, 255)}
							FontFace={fonts.gothic.bold}
							TextSize={rem(1.5)}
							Event={{
								MouseButton1Down: () => {},
							}}
						/>
					</Frame>
					<Text
						text={selectedPerk ? `${selectedPerk.price} CREDITS` : "XXX CREDITS"}
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
