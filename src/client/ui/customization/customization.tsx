import { useMountEffect } from "@rbxts/pretty-react-hooks";
import { useSelector } from "@rbxts/react-reflex";
import Roact from "@rbxts/roact";
import { RunService } from "@rbxts/services";
import { clientStore } from "client/store";
import { selectCustomizationIsOpen } from "client/store/customization";
import { CustomizationButton } from "client/ui/customization/customization-button";
import { useMotion, useRem } from "client/ui/hooks";
import { Button } from "client/ui/library/button/button";
import { Frame, ScrollingFrame } from "client/ui/library/frame";
import { Text } from "client/ui/library/text";
import { springs } from "shared/constants/springs";

const DEBUG = !RunService.IsRunning();

export function Customization() {
	const rem = useRem();

	const [menuPosition, menuPositionMotion] = useMotion(UDim2.fromScale(-1));
	const menuOpen = DEBUG ? true : useSelector(selectCustomizationIsOpen);

	clientStore.subscribe(selectCustomizationIsOpen, (open) => {
		menuPositionMotion.spring(open ? UDim2.fromScale() : UDim2.fromScale(-1), springs.stiff);
	});

	useMountEffect(() => {
		if (!RunService.IsRunning()) {
			menuPositionMotion.spring(UDim2.fromScale(), springs.stiff);
		}
	});

	return (
		<>
			{menuOpen && (
				<Frame
					position={menuPosition}
					size={new UDim2(0, rem(40), 1, 0)}
					backgroundColor={Color3.fromRGB(0, 0, 0)}
					borderSize={6}
					borderColor={Color3.fromRGB(52, 72, 98)}
					backgroundTransparency={0.15}
				>
					<Text
						text={"ARMOR CUSTOMIZATION"}
						textSize={rem(2.5)}
						textXAlignment={"Left"}
						backgroundTransparency={1}
						font={Font.fromEnum(Enum.Font.Highway)}
						textColor={Color3.fromRGB(255, 255, 255)}
						position={UDim2.fromOffset(rem(2), rem(2))}
						size={UDim2.fromOffset(rem(30), rem(2))}
					/>
					<Frame
						position={UDim2.fromOffset(rem(2), rem(5))}
						size={UDim2.fromOffset(rem(37), rem(0.1))}
						backgroundColor={Color3.fromRGB(255, 255, 255)}
					>
						<Button
							text={"ARMOR"}
							backgroundTransparency={1}
							textColor={Color3.fromRGB(255, 255, 255)}
							fontFace={Font.fromEnum(Enum.Font.Highway)}
							position={UDim2.fromOffset(rem(5), rem(1))}
							anchorPoint={new Vector2(0.5, 0.5)}
							size={UDim2.fromOffset(rem(10), rem(3))}
							textSize={rem(1.5)}
						/>

						<Button
							text={"OUTFIT"}
							backgroundTransparency={1}
							textColor={Color3.fromRGB(255, 255, 255)}
							fontFace={Font.fromEnum(Enum.Font.Highway)}
							position={UDim2.fromOffset(rem(15), rem(1))}
							anchorPoint={new Vector2(0.5, 0.5)}
							size={UDim2.fromOffset(rem(10), rem(3))}
							textSize={rem(1.5)}
						/>

						<Button
							text={"ACCESSORIES"}
							backgroundTransparency={1}
							textColor={Color3.fromRGB(255, 255, 255)}
							fontFace={Font.fromEnum(Enum.Font.Highway)}
							position={UDim2.fromOffset(rem(25), rem(1))}
							anchorPoint={new Vector2(0.5, 0.5)}
							size={UDim2.fromOffset(rem(10), rem(3))}
							textSize={rem(1.5)}
						/>
					</Frame>
					<ScrollingFrame
						position={UDim2.fromOffset(rem(2), rem(7.5))}
						size={UDim2.fromOffset(rem(37), rem(32.5))}
						backgroundTransparency={1}
						automaticSizing={"Y"}
					>
						<uigridlayout
							CellSize={UDim2.fromOffset(rem(65), rem(7.5))}
							CellPadding={UDim2.fromOffset(0, 25)}
							FillDirection={Enum.FillDirection.Horizontal}
							FillDirectionMaxCells={0}
							HorizontalAlignment={Enum.HorizontalAlignment.Left}
							SortOrder={Enum.SortOrder.LayoutOrder}
							StartCorner={Enum.StartCorner.TopLeft}
							VerticalAlignment={Enum.VerticalAlignment.Top}
						/>

						<CustomizationButton name={"Omega Drip"} previewImage={"rbxassetid://12782676216"} />
					</ScrollingFrame>
					<Text
						text={"CHARACTER CUSTOMIZATION"}
						textSize={rem(2.5)}
						textXAlignment={"Left"}
						backgroundTransparency={1}
						font={Font.fromEnum(Enum.Font.Highway)}
						textColor={Color3.fromRGB(255, 255, 255)}
						position={UDim2.fromOffset(rem(2), rem(30))}
						size={UDim2.fromOffset(rem(30), rem(2))}
					/>
					<Frame
						position={UDim2.fromOffset(rem(2), rem(33))}
						size={UDim2.fromOffset(rem(37), rem(0.1))}
						backgroundColor={Color3.fromRGB(255, 255, 255)}
					>
						<Button
							text={"GUNS"}
							backgroundTransparency={1}
							textColor={Color3.fromRGB(255, 255, 255)}
							fontFace={Font.fromEnum(Enum.Font.Highway)}
							position={UDim2.fromOffset(rem(5), rem(1))}
							anchorPoint={new Vector2(0.5, 0.5)}
							size={UDim2.fromScale(0.2, 45.5)}
							textSize={rem(1.5)}
						/>

						<Button
							text={"FACE"}
							backgroundTransparency={1}
							textColor={Color3.fromRGB(255, 255, 255)}
							fontFace={Font.fromEnum(Enum.Font.Highway)}
							position={UDim2.fromOffset(rem(15), rem(1))}
							anchorPoint={new Vector2(0.5, 0.5)}
							size={UDim2.fromScale(0.2, 45.5)}
							textSize={rem(1.5)}
						/>

						<Button
							text={"SKIN TONE"}
							backgroundTransparency={1}
							textColor={Color3.fromRGB(255, 255, 255)}
							fontFace={Font.fromEnum(Enum.Font.Highway)}
							position={UDim2.fromOffset(rem(25), rem(1))}
							anchorPoint={new Vector2(0.5, 0.5)}
							size={UDim2.fromScale(0.2, 45.5)}
							textSize={rem(1.5)}
						/>
					</Frame>
					<ScrollingFrame
						position={UDim2.fromOffset(rem(2), rem(35.5))}
						size={UDim2.fromOffset(rem(37), rem(15))}
						backgroundTransparency={1}
						automaticSizing={"Y"}
					>
						<uigridlayout
							CellSize={UDim2.fromOffset(rem(65), rem(7.5))}
							CellPadding={UDim2.fromOffset(0, 25)}
							FillDirection={Enum.FillDirection.Horizontal}
							FillDirectionMaxCells={0}
							HorizontalAlignment={Enum.HorizontalAlignment.Left}
							SortOrder={Enum.SortOrder.LayoutOrder}
							StartCorner={Enum.StartCorner.TopLeft}
							VerticalAlignment={Enum.VerticalAlignment.Top}
						/>

						<CustomizationButton name={"AK-105"} previewImage={"rbxassetid://5124711907"} setContext />
						<CustomizationButton name={"AK-105S"} previewImage={"rbxassetid://5124711907"} setContext />
					</ScrollingFrame>
				</Frame>
			)}
		</>
	);
}
