import { useSelector } from "@rbxts/react-reflex";
import Roact from "@rbxts/roact";
import { clientStore } from "client/store";
import { ShopItem as BaseShopItem, selectActiveShopItem, selectDevProducts, selectGamePasses } from "client/store/shop";
import { fonts } from "shared/constants/fonts";
import { Frame } from "../../frame";
import { Text } from "../../text";
import { SideInformation } from "../side-information";

function ShopItem(props: { shopItem: BaseShopItem }) {
	const { title, color } = props.shopItem;
	const itemType = props.shopItem.type;
	const darkenedColor = color.Lerp(Color3.fromRGB(0, 0, 0), 0.5);
	const lightenedColor = color.Lerp(Color3.fromRGB(255, 255, 255), 0.5);
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
				position={UDim2.fromScale(0.016, 0)}
				size={UDim2.fromScale(0.025, 1)}
				backgroundColor={lightenedColor}
			/>
			<Text
				text={title}
				font={fonts.gothic.regular}
				textColor={Color3.fromRGB(255, 255, 255)}
				position={UDim2.fromScale(0.081, 0.1)}
				size={UDim2.fromScale(0.3, 0.5)}
				textSize={16}
				textXAlignment="Left"
			/>
			<Text
				text={itemType.upper()}
				font={fonts.gothic.bold}
				textColor={Color3.fromRGB(255, 255, 255)}
				position={UDim2.fromScale(0.081, 0.325)}
				size={UDim2.fromScale(0.3, 0.5)}
				textSize={16}
				textXAlignment="Left"
			/>
			<Frame
				key="location-marker"
				backgroundTransparency={0.6}
				backgroundColor={Color3.fromRGB(0, 0, 0)}
				borderColor={Color3.fromRGB(255, 255, 255)}
				borderSize={1}
				position={UDim2.fromScale(0.885, 0.28)}
				size={UDim2.fromOffset(25, 25)}
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
	const gamepasses = useSelector(selectGamePasses);
	const devProducts = useSelector(selectDevProducts);
	const selectedShopItem = useSelector(selectActiveShopItem);

	return (
		<>
			<SideInformation />
			<scrollingframe
				key="items"
				Position={UDim2.fromScale(0.22, 0.14)}
				Size={UDim2.fromScale(0.5, 0.825)}
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
					CellSize={UDim2.fromScale(1, 0.08)}
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
						textSize={26}
						position={UDim2.fromScale(0.016, 0)}
						textYAlignment="Center"
						size={UDim2.fromScale(1, 0.6)}
					/>
					<Text
						text="(Credit Shop Below)"
						textColor={Color3.fromRGB(255, 255, 255)}
						font={fonts.gothic.regular}
						textSize={16}
						position={UDim2.fromScale(0.016, 0.3)}
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
						textSize={26}
						position={UDim2.fromScale(0.016, 0.15)}
						textYAlignment="Center"
						size={UDim2.fromScale(1, 0.6)}
					/>
				</Frame>
				{devProducts.map((devProduct) => (
					<ShopItem shopItem={devProduct} />
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
					text={selectedShopItem ? `${selectedShopItem.title}` : "INFORMATION"}
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
						text={selectedShopItem ? `${selectedShopItem.description}` : ""}
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
						text={selectedShopItem ? `${selectedShopItem.price} ROBUX` : "XXX ROBUX"}
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
