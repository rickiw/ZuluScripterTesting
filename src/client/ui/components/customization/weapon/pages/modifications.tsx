import { useSelector } from "@rbxts/react-reflex";
import Roact from "@rbxts/roact";
import { selectSelectedModificationMount, selectSelectedWeapon } from "client/store/customization";
import { selectModificationMounts } from "client/store/interaction";
import { selectWeapons } from "client/store/inventory";
import { SCPScrollingFrame } from "client/ui/components/scp";
import { useRem } from "client/ui/hooks";
import { getModifications } from "shared/constants/weapons";
import { ModificationSelector } from "../modification-selector";
import { ModificationTypeSelector } from "../modification-type-selector";
import { WeaponSelector } from "../weapon-selector";

export function CustomizeModificationsPage() {
	const rem = useRem();

	const selectedWeapon = useSelector(selectSelectedWeapon);
	const matchingModifications = selectedWeapon ? getModifications(selectedWeapon.baseTool.Name as WEAPON)! : [];
	const modificationMounts = useSelector(selectModificationMounts);
	const selectedModificationMount = useSelector(selectSelectedModificationMount);
	const allWeapons = useSelector(selectWeapons);

	return (
		<>
			<SCPScrollingFrame
				size={UDim2.fromScale(1, 1)}
				backgroundTransparency={1}
				automaticCanvasSizing={"Y"}
				canvasSize={UDim2.fromScale(1, 0)}
			>
				<uipadding PaddingTop={new UDim(0, rem(1))} />
				<uigridlayout
					CellSize={UDim2.fromOffset(rem(16), rem(10))}
					VerticalAlignment="Top"
					HorizontalAlignment="Center"
					CellPadding={UDim2.fromOffset(rem(1), rem(1))}
				/>

				{!selectedWeapon && (
					<>
						{allWeapons
							.sort((a, b) => a.baseTool.Name < b.baseTool.Name)
							.map((weapon) => (
								<WeaponSelector weapon={weapon} previewImage="handgun" />
							))}
					</>
				)}
				{selectedWeapon && selectedModificationMount && (
					<>
						{matchingModifications
							.filter((modification) => modification.type === selectedModificationMount.Name)
							.map((modification) => (
								<ModificationSelector modification={modification} previewImage="attachments" />
							))}
					</>
				)}
				{selectedWeapon && !selectedModificationMount && (
					<>
						{modificationMounts.map((modification) => (
							<ModificationTypeSelector
								forWeapon={selectedWeapon.baseTool.Name}
								modificationType={modification.Name}
								modificationMount={modification}
								previewImage="attachments"
							/>
						))}
					</>
				)}
			</SCPScrollingFrame>
		</>
	);
}
