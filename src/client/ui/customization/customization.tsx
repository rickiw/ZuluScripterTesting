import { useCamera } from "@rbxts/pretty-react-hooks";
import Roact, { useEffect, useState } from "@rbxts/roact";
import { ReplicatedStorage } from "@rbxts/services";
import { FirearmInstance } from "client/components/BaseFirearm";
import { CustomizationButton } from "client/ui/customization/customization-button";
import { useRem } from "client/ui/hooks";
import { Button } from "client/ui/library/button/button";
import { Frame, ScrollingFrame } from "client/ui/library/frame";
import { Text } from "client/ui/library/text";
import { SelectedWeaponContext } from "../context/customization";

export function Customization() {
	const rem = useRem();
	const camera = useCamera();
	const screenSize = camera.ViewportSize;

	const [selectedWeapon, setSelectedWeapon] = useState("");
	const [weapon, setWeapon] = useState<FirearmInstance | undefined>(undefined);

	useEffect(() => {
		if (selectedWeapon !== "") {
			const tool = ReplicatedStorage.Assets.Weapons.FindFirstChild(selectedWeapon);
			if (tool) {
				print("set " + tool.Name);
				setWeapon(tool as FirearmInstance);
			} else {
				warn("No tool found with name " + selectedWeapon);
			}
		}
	}, [selectedWeapon]);

	return (
		<>
			<SelectedWeaponContext.Provider value={[selectedWeapon, setSelectedWeapon]}>
				<Frame
					position={UDim2.fromScale(0)}
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
				<Frame
					backgroundTransparency={1}
					position={UDim2.fromOffset(rem(40), 0)}
					size={new UDim2(0, screenSize.X - rem(40), 1, 0)}
				>
					<Text
						text={"PREVIEW"}
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
						size={UDim2.fromOffset(rem(80), rem(42.5))}
						backgroundColor={Color3.fromRGB(255, 255, 255)}
					>
						{/* <WeaponPreview weapon={weapon} /> */}
					</Frame>
				</Frame>
			</SelectedWeaponContext.Provider>
		</>
	);
}
