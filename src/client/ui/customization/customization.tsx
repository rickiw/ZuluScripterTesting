import { useMountEffect } from "@rbxts/pretty-react-hooks";
import { useSelector } from "@rbxts/react-reflex";
import Roact, { useEffect } from "@rbxts/roact";
import { RunService } from "@rbxts/services";
import { clientStore } from "client/store";
import { selectCustomizationIsOpen, selectSelectedWeapon } from "client/store/customization";
import { selectWeapons } from "client/store/inventory";
import { CustomizationButton } from "client/ui/customization/customization-button";
import { useMotion, useRem } from "client/ui/hooks";
import { Button } from "client/ui/library/button/button";
import { Frame, ScrollingFrame } from "client/ui/library/frame";
import { Text } from "client/ui/library/text";
import { springs } from "shared/constants/springs";
import { SmallButton } from "../library/menu/small-button";
import { WeaponButton } from "./weapon-button";

const DEBUG = !RunService.IsRunning();

export function Customization() {
	const rem = useRem();

	const [menuPosition, menuPositionMotion] = useMotion(UDim2.fromScale(-1));
	const menuOpen = DEBUG ? true : useSelector(selectCustomizationIsOpen);
	const selectedWeapon = useSelector(selectSelectedWeapon);
	const allWeapons = useSelector(selectWeapons);

	useEffect(() => {
		menuPositionMotion.spring(menuOpen ? UDim2.fromScale() : UDim2.fromScale(-1), springs.stiff);
	}, [menuOpen]);

	useMountEffect(() => {
		if (DEBUG) {
			menuPositionMotion.spring(menuOpen ? UDim2.fromScale() : UDim2.fromScale(-1), springs.stiff);
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
					backgroundTransparency={0}
				>
					{selectedWeapon !== undefined && (
						<Button
							text={"Modify"}
							position={new UDim2(0, rem(45), 0.9, 0)}
							backgroundTransparency={0}
							backgroundColor={Color3.fromRGB(0, 0, 0)}
							borderColor={Color3.fromRGB(255, 255, 255)}
							borderSize={1}
							textColor={Color3.fromRGB(255, 255, 255)}
							fontFace={Font.fromEnum(Enum.Font.Highway)}
							textSize={rem(2)}
							size={UDim2.fromOffset(rem(10), rem(2.5))}
							event={{
								MouseButton1Click: () => {
									clientStore.setCustomizingWeapon(true);
								},
							}}
						/>
					)}

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
						<uipadding PaddingTop={new UDim(0, rem(2.25))} />
						<uigridlayout
							VerticalAlignment={Enum.VerticalAlignment.Center}
							HorizontalAlignment={Enum.HorizontalAlignment.Center}
							CellSize={UDim2.fromOffset(rem(10), rem(7.5))}
						/>

						<SmallButton text="ARMOR" onClick={() => {}} />
						<SmallButton text="OUTFIT" onClick={() => {}} />
						<SmallButton text="ACCESSORIES" onClick={() => {}} />
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
						<uipadding PaddingTop={new UDim(0, rem(2.25))} />
						<uigridlayout
							VerticalAlignment={Enum.VerticalAlignment.Center}
							HorizontalAlignment={Enum.HorizontalAlignment.Center}
							CellSize={UDim2.fromOffset(rem(10), rem(7.5))}
						/>

						<SmallButton text="SKIN TONE" onClick={() => {}} />
						<SmallButton text="FACE" onClick={() => {}} />
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

						{allWeapons
							.sort((a, b) => a.baseTool.Name < b.baseTool.Name)
							.map((weapon) => (
								<WeaponButton weapon={weapon} previewImage="rbxassetid://5124711907" />
							))}
					</ScrollingFrame>
				</Frame>
			)}
		</>
	);
}
