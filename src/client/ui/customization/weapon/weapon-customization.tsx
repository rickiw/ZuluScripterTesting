import { useMountEffect } from "@rbxts/pretty-react-hooks";
import { useSelector } from "@rbxts/react-reflex";
import Roact, { useEffect, useState } from "@rbxts/roact";
import { RunService } from "@rbxts/services";
import {
	selectCustomizationIsOpen,
	selectSelectedModification,
	selectSelectedWeapon,
} from "client/store/customization";
import { selectWeapons } from "client/store/inventory";
import { useMotion, useRem } from "client/ui/hooks";
import { Frame, ScrollingFrame } from "client/ui/library/frame";
import { SmallButton } from "client/ui/library/menu/small-button";
import { Text } from "client/ui/library/text";
import { FIREARM_TYPE } from "shared/constants/firearm";
import { springs } from "shared/constants/springs";
import { IModification, getModifications } from "shared/constants/weapons";
import { ModificationButton } from "../modification-button";
import { WeaponButton } from "../weapon-button";
import { ActionButton } from "./action-button";

const DEBUG = !RunService.IsRunning();

export function WeaponCustomization() {
	const rem = useRem();

	const [selectedWeaponTypes, setSelectedWeaponTypes] = useState<FIREARM_TYPE>("Primary");
	const [menuPosition, menuPositionMotion] = useMotion(UDim2.fromScale(-1));

	const selectedWeapon = useSelector(selectSelectedWeapon);

	const allWeapons = useSelector(selectWeapons);
	const matchingModifications = selectedWeapon
		? getModifications(selectedWeapon.baseTool.Name as WEAPON)!
		: ([] as IModification[]);
	const menuOpen = useSelector(selectCustomizationIsOpen);

	const selectedModification = useSelector(selectSelectedModification);

	useEffect(() => {
		menuPositionMotion.spring(menuOpen ? UDim2.fromScale() : UDim2.fromScale(-1), springs.stiff);
	}, [menuOpen]);

	useMountEffect(() => {
		if (DEBUG) {
			menuPositionMotion.spring(UDim2.fromScale(), springs.stiff);
		}
	});

	return (
		<>
			<Frame
				position={menuPosition}
				size={new UDim2(0, rem(40), 1, 0)}
				backgroundColor={Color3.fromRGB(0, 0, 0)}
				borderSize={6}
				borderColor={Color3.fromRGB(52, 72, 98)}
				backgroundTransparency={0}
			>
				{selectedWeapon && <ActionButton />}

				<Text
					text={"WEAPON CUSTOMIZATION"}
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

					<SmallButton text="PRIMARY" onClick={() => setSelectedWeaponTypes("Primary")} />
					<SmallButton text="SECONDARY" onClick={() => setSelectedWeaponTypes("Secondary")} />
					<SmallButton text="ITEMS" onClick={() => {}} />
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

					{allWeapons
						.filter((weapon) => weapon.weaponType === selectedWeaponTypes)
						.sort((a, b) => a.baseTool.Name < b.baseTool.Name)
						.map((weapon) => (
							<WeaponButton weapon={weapon} previewImage="rbxassetid://5124711907" />
						))}
				</ScrollingFrame>

				{selectedWeapon && selectedModification && (
					<>
						<Text
							text={selectedModification.Name.upper()}
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
						/>

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

							{matchingModifications
								.filter((modification) => modification.type === selectedModification.Name)
								.map((modification) => (
									<ModificationButton
										modification={modification}
										previewImage="rbxassetid://12782676216"
									/>
								))}
						</ScrollingFrame>
					</>
				)}

				{/* <Frame
					backgroundTransparency={1}
					position={UDim2.fromOffset(rem(19), rem(40))}
					size={UDim2.fromOffset(100, 100)}
				>
					<UpgradeIndicator
						modification={ReplicatedStorage.Assets.Attachments.Suppressor as WeaponModificationMount}
						clicked={() => {
							print("clicked");
						}}
					/>
				</Frame> */}
			</Frame>
		</>
	);
}
