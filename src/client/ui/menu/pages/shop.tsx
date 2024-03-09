import { lerpBinding } from "@rbxts/pretty-react-hooks";
import { useSelector } from "@rbxts/react-reflex";
import Roact from "@rbxts/roact";
import { clientStore } from "client/store";
import { ShopItem as BaseShopItem, selectActiveShopItem, selectDevProducts, selectGamePasses } from "client/store/shop";
import { useMotion, useRem } from "client/ui/hooks";
import { Frame } from "client/ui/library/frame";
import { Text } from "client/ui/library/text";
import { fonts } from "shared/constants/fonts";
import { springs } from "shared/constants/springs";
import { SideInformation } from "../side-information";

function ShopItem(props: { shopItem: BaseShopItem }) {
	const rem = useRem();

	const { title, color } = props.shopItem;
	const itemType = props.shopItem.type;
	const darkenedColor = color.Lerp(Color3.fromRGB(0, 0, 0), 0.5);
	const lightenedColor = color.Lerp(Color3.fromRGB(255, 255, 255), 0.5);

	const [hover, hoverMotion] = useMotion(0);

	return (
		<Frame key={title} backgroundColor={Color3.fromRGB(227, 227, 227)}>
			<uigradient
				Color={
					new ColorSequence([
						new ColorSequenceKeypoint(0, color),
						new ColorSequenceKeypoint(1, darkenedColor),
					])
				}
				Transparency={
					new NumberSequence([new NumberSequenceKeypoint(0, 0.5), new NumberSequenceKeypoint(1, 0.5)])
				}
			/>
			<Frame
				key="status-marker"
				position={UDim2.fromOffset(rem(1), 0)}
				size={UDim2.fromOffset(rem(2.5), rem(10))}
				backgroundColor={lightenedColor}
			/>
			<Text
				text={title}
				font={fonts.gothic.regular}
				textColor={Color3.fromRGB(255, 255, 255)}
				position={UDim2.fromOffset(rem(5), 0)}
				size={UDim2.fromOffset(rem(2.5), rem(5))}
				textSize={rem(2.5)}
				textXAlignment="Left"
				textYAlignment="Bottom"
			/>
			<Text
				text={itemType.upper()}
				font={fonts.gothic.regular}
				textColor={Color3.fromRGB(255, 255, 255)}
				position={UDim2.fromOffset(rem(5), rem(5))}
				size={UDim2.fromOffset(rem(2.5), rem(5))}
				textSize={rem(2)}
				textXAlignment="Left"
				textYAlignment="Top"
			/>
			<Frame
				key="location-marker"
				backgroundTransparency={0.6}
				backgroundColor={Color3.fromRGB(0, 0, 0)}
				borderColor={Color3.fromRGB(255, 255, 255)}
				borderSize={1}
				anchorPoint={new Vector2(0.5, 0.5)}
				position={UDim2.fromOffset(rem(60), rem(5))}
				size={lerpBinding(hover, UDim2.fromOffset(40, 40), UDim2.fromOffset(45, 45))}
				event={{
					MouseEnter: () => hoverMotion.spring(1, springs.responsive),
					MouseLeave: () => hoverMotion.spring(0, springs.responsive),
				}}
			>
				<textbutton
					BackgroundTransparency={1}
					Size={UDim2.fromScale(1, 1)}
					Text="!"
					TextColor3={Color3.fromRGB(255, 255, 255)}
					FontFace={fonts.gothic.bold}
					TextScaled={true}
					Event={{
						MouseButton1Down: () => clientStore.setSelectedShopItem(props.shopItem),
					}}
				/>
			</Frame>
		</Frame>
	);
}

export function ShopPage() {
	const rem = useRem();

	const gamepasses = useSelector(selectGamePasses);
	const devProducts = useSelector(selectDevProducts);
	const selectedShopItem = useSelector(selectActiveShopItem);

	return (
		<>
			<SideInformation />
			<scrollingframe
				key="items"
				Position={UDim2.fromOffset(rem(26), rem(7.5))}
				Size={UDim2.fromOffset(rem(65), rem(42.5))}
				BackgroundTransparency={0.5}
				BackgroundColor3={Color3.fromRGB(0, 0, 0)}
				BorderSizePixel={1}
				BorderColor3={Color3.fromRGB(255, 255, 255)}
				ScrollBarThickness={7}
				VerticalScrollBarPosition={Enum.VerticalScrollBarPosition.Left}
			>
				<uigridlayout
					FillDirectionMaxCells={0}
					FillDirection={Enum.FillDirection.Horizontal}
					CellSize={UDim2.fromOffset(rem(65), rem(10))}
					SortOrder={Enum.SortOrder.LayoutOrder}
				/>
				<Frame key="gamepass-header" backgroundTransparency={1}>
					<Frame
						backgroundTransparency={0.85}
						backgroundColor={Color3.fromRGB(0, 0, 0)}
						borderColor={Color3.fromRGB(255, 255, 255)}
						borderSize={1}
						size={UDim2.fromScale(1, 1)}
					/>
					<Text
						text="GAMEPASS SHOP"
						textColor={Color3.fromRGB(255, 255, 255)}
						font={fonts.gothic.regular}
						textSize={rem(3)}
						position={UDim2.fromOffset(rem(1), rem(0.5))}
						textYAlignment="Center"
						size={UDim2.fromScale(1, 0.6)}
					/>
					<Text
						text="(Credit Shop Below)"
						textColor={Color3.fromRGB(255, 255, 255)}
						font={fonts.gothic.regular}
						textSize={rem(1.5)}
						position={UDim2.fromOffset(rem(1), rem(3.5))}
						textYAlignment="Center"
						size={UDim2.fromScale(1, 0.6)}
					/>
				</Frame>
				{gamepasses.map((gamepass) => (
					<ShopItem shopItem={gamepass} />
				))}
				<Frame key="credits-header" backgroundTransparency={1}>
					<Frame
						backgroundTransparency={0.85}
						backgroundColor={Color3.fromRGB(0, 0, 0)}
						borderColor={Color3.fromRGB(255, 255, 255)}
						borderSize={1}
						size={UDim2.fromScale(1, 1)}
					/>
					<Text
						text="CREDIT SHOP"
						textColor={Color3.fromRGB(255, 255, 255)}
						font={fonts.gothic.regular}
						textSize={rem(3)}
						position={UDim2.fromOffset(rem(1), rem(0))}
						textYAlignment="Center"
						size={UDim2.fromScale(1, 1)}
					/>
				</Frame>
				{devProducts.map((devProduct) => (
					<ShopItem shopItem={devProduct} />
				))}
			</scrollingframe>
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
					text={selectedShopItem ? `${selectedShopItem.title}` : "INFORMATION"}
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
						text={selectedShopItem ? `${selectedShopItem.description}` : ""}
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
							Text="BUY"
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
						text={selectedShopItem ? `${selectedShopItem.price} ROBUX` : "XXX ROBUX"}
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
