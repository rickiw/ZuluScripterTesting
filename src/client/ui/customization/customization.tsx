import Roact, { useBinding, useEffect } from "@rbxts/roact";
import { clientStore } from "client/store";
import { selectCustomizationIsOpen } from "client/store/customization";
import { CustomizationButton } from "client/ui/customization/customization-button";
import { CharacterGunsFrame } from "client/ui/customization/frames/character-guns";
import { useMotion } from "client/ui/hooks";
import { Button } from "client/ui/library/button/button";
import { Frame, ScrollingFrame } from "client/ui/library/frame";
import { Text } from "client/ui/library/text";
import { springs } from "shared/constants/springs";

export function Customization() {
	const [armorXPosition, armorXPositionMotion] = useMotion(0);
	const [characterXPosition, characterXPositionMotion] = useMotion(0);
	const [hoveredArmor, setHoveredArmor] = useBinding(false);
	const [hoveredCharacter, setHoveredCharacter] = useBinding(false);
	const [menuPosition, menuPositionMotion] = useMotion(UDim2.fromScale(-1));

	// listen for hoveredArmor & character to change
	useEffect(() => {
		armorXPositionMotion.spring(hoveredArmor ? 0.01 : 0, springs.stiff);
		characterXPositionMotion.spring(hoveredCharacter ? 0.01 : 0, springs.stiff);
		clientStore.setCameraLockedCenter(menuPosition.getValue() !== UDim2.fromScale(-1));
	}, [hoveredArmor, hoveredCharacter]);

	clientStore.subscribe(selectCustomizationIsOpen, (open) => {
		menuPositionMotion.spring(open ? UDim2.fromScale() : UDim2.fromScale(-1), springs.stiff);
	});

	return (
		<Frame
			position={menuPosition}
			size={UDim2.fromScale(0.25, 1)}
			backgroundColor={Color3.fromRGB(0, 0, 0)}
			borderSize={6}
			borderColor={Color3.fromRGB(52, 72, 98)}
			backgroundTransparency={0.15}
		>
			<Text
				text={"ARMOR CUSTOMIZATION"}
				textScaled={true}
				textXAlignment={"Left"}
				backgroundTransparency={1}
				font={Font.fromEnum(Enum.Font.Highway)}
				textColor={Color3.fromRGB(255, 255, 255)}
				position={armorXPosition.map((x) => UDim2.fromScale(0.05 + x, 0.04))}
				size={UDim2.fromScale(0.725, 0.045)}
				event={{
					MouseEnter: () => setHoveredArmor(true),
					MouseLeave: () => setHoveredArmor(false),
				}}
			/>

			<Frame
				position={UDim2.fromScale(0.05, 0.082)}
				size={UDim2.fromScale(0.9, 0.001)}
				backgroundColor={Color3.fromRGB(255, 255, 255)}
			>
				<Button
					text={"ARMOR"}
					backgroundTransparency={1}
					textColor={Color3.fromRGB(255, 255, 255)}
					fontFace={Font.fromEnum(Enum.Font.Highway)}
					position={UDim2.fromScale(0.225, 15.5)}
					anchorPoint={new Vector2(0.5, 0.5)}
					size={UDim2.fromScale(0.2, 45.5)}
					textSize={18}
				/>

				<Button
					text={"OUTFIT"}
					backgroundTransparency={1}
					textColor={Color3.fromRGB(255, 255, 255)}
					fontFace={Font.fromEnum(Enum.Font.Highway)}
					position={UDim2.fromScale(0.425, 15.5)}
					anchorPoint={new Vector2(0.5, 0.5)}
					size={UDim2.fromScale(0.2, 45.5)}
					textSize={18}
				/>

				<Button
					text={"ACCESSORIES"}
					backgroundTransparency={1}
					textColor={Color3.fromRGB(255, 255, 255)}
					fontFace={Font.fromEnum(Enum.Font.Highway)}
					position={UDim2.fromScale(0.695, 15.5)}
					anchorPoint={new Vector2(0.5, 0.5)}
					size={UDim2.fromScale(0.2, 45.5)}
					textSize={18}
				/>
			</Frame>

			<ScrollingFrame
				position={UDim2.fromScale(0.045, 0.135)}
				size={UDim2.fromScale(0.9, 0.39)}
				backgroundTransparency={1}
				automaticSizing={"Y"}
			>
				<uigridlayout
					CellSize={UDim2.fromScale(0.95, 0.05)}
					CellPadding={UDim2.fromOffset(320, 100)}
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
				textScaled={true}
				textXAlignment={"Left"}
				backgroundTransparency={1}
				font={Font.fromEnum(Enum.Font.Highway)}
				textColor={Color3.fromRGB(255, 255, 255)}
				position={characterXPosition.map((x) => UDim2.fromScale(0.05 + x, 0.57))}
				size={UDim2.fromScale(0.725, 0.045)}
				event={{
					MouseEnter: () => setHoveredCharacter(true),
					MouseLeave: () => setHoveredCharacter(false),
				}}
			/>

			<Frame
				position={UDim2.fromScale(0.05, 0.61)}
				size={UDim2.fromScale(0.9, 0.001)}
				backgroundColor={Color3.fromRGB(255, 255, 255)}
			>
				<Button
					text={"GUNS"}
					backgroundTransparency={1}
					textColor={Color3.fromRGB(255, 255, 255)}
					fontFace={Font.fromEnum(Enum.Font.Highway)}
					position={UDim2.fromScale(0.225, 15.5)}
					anchorPoint={new Vector2(0.5, 0.5)}
					size={UDim2.fromScale(0.2, 45.5)}
					textSize={18}
				/>

				<Button
					text={"FACE"}
					backgroundTransparency={1}
					textColor={Color3.fromRGB(255, 255, 255)}
					fontFace={Font.fromEnum(Enum.Font.Highway)}
					position={UDim2.fromScale(0.425, 15.5)}
					anchorPoint={new Vector2(0.5, 0.5)}
					size={UDim2.fromScale(0.2, 45.5)}
					textSize={18}
				/>

				<Button
					text={"SKIN TONE"}
					backgroundTransparency={1}
					textColor={Color3.fromRGB(255, 255, 255)}
					fontFace={Font.fromEnum(Enum.Font.Highway)}
					position={UDim2.fromScale(0.695, 15.5)}
					anchorPoint={new Vector2(0.5, 0.5)}
					size={UDim2.fromScale(0.2, 45.5)}
					textSize={18}
				/>
			</Frame>

			<CharacterGunsFrame position={UDim2.fromScale(0.045, 0.665)} size={UDim2.fromScale(0.9, 0.237)} />
		</Frame>
	);
}
