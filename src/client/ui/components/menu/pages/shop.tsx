import { useSelector } from "@rbxts/react-reflex";
import Roact from "@rbxts/roact";
import { clientStore } from "client/store";
import { ShopItem as BaseShopItem, selectActiveShopItem, selectDevProducts, selectGamePasses } from "client/store/shop";
import { useMotion, useRem } from "client/ui/hooks";
import { Button } from "client/ui/library/button/button";
import { Frame } from "client/ui/library/frame";
import { Text } from "client/ui/library/text";
import { fonts } from "shared/constants/fonts";
import { SideInformation } from "../side-information";

function ShopItem(props: { shopItem: BaseShopItem }) {
	const rem = useRem();

	const { title, color } = props.shopItem;
	const itemType = props.shopItem.type;
	const selectedShopItem = useSelector(selectActiveShopItem);

	const [hover, hoverMotion] = useMotion(0);

	return (
		<Button
			key={title}
			backgroundColor={Color3.fromRGB(227, 227, 227)}
			event={{
				MouseButton1Click: () => clientStore.setSelectedShopItem(props.shopItem),
			}}
			backgroundTransparency={selectedShopItem !== props.shopItem ? 0.95 : 0}
		>
			{selectedShopItem !== props.shopItem && (
				<uistroke
					ApplyStrokeMode="Border"
					Color={
						selectedShopItem === props.shopItem
							? Color3.fromRGB(255, 156, 0)
							: Color3.fromRGB(255, 255, 255)
					}
				/>
			)}
			<uigradient
				Color={
					selectedShopItem === props.shopItem
						? new ColorSequence([
								new ColorSequenceKeypoint(0, Color3.fromRGB(245, 146, 0)),
								new ColorSequenceKeypoint(1, Color3.fromRGB(252, 212, 120)),
							])
						: new ColorSequence([
								new ColorSequenceKeypoint(0, Color3.fromRGB(255, 255, 255)),
								new ColorSequenceKeypoint(1, Color3.fromRGB(122, 122, 122)),
							])
				}
				Transparency={
					new NumberSequence([new NumberSequenceKeypoint(0, 0.5), new NumberSequenceKeypoint(1, 1)])
				}
			/>

			<Frame
				key="status-marker"
				size={UDim2.fromOffset(rem(2.5), rem(10))}
				backgroundColor={
					selectedShopItem === props.shopItem ? Color3.fromRGB(255, 156, 0) : Color3.fromRGB(210, 210, 210)
				}
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
		</Button>
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
					CellPadding={UDim2.fromOffset(0, rem(0.5))}
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
