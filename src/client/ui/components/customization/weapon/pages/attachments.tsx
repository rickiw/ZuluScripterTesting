import { useSelector } from "@rbxts/react-reflex";
import Roact from "@rbxts/roact";
import { selectSelectedModificationMount, selectSelectedWeapon } from "client/store/customization";
import { SCPScrollingFrame } from "client/ui/components/scp";
import { useRem } from "client/ui/hooks";
import { getModifications } from "shared/constants/weapons";
import { ModificationSelector } from "../modification-selector";

export function CustomizeAttachmentsPage() {
	const rem = useRem();

	const selectedWeapon = useSelector(selectSelectedWeapon);
	const matchingModifications = selectedWeapon ? getModifications(selectedWeapon.baseTool.Name as WEAPON)! : [];
	const selectedModificationMount = useSelector(selectSelectedModificationMount);

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

				{selectedWeapon && selectedModificationMount && (
					<>
						{matchingModifications
							.filter((modification) => modification.type === selectedModificationMount.Name)
							.map((modification) => (
								<ModificationSelector modification={modification} previewImage="attachments" />
							))}
					</>
				)}
			</SCPScrollingFrame>
		</>
	);
}
