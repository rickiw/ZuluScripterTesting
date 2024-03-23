import Log from "@rbxts/log";
import { useSelector } from "@rbxts/react-reflex";
import Roact from "@rbxts/roact";
import { Events } from "client/network";
import { clientStore } from "client/store";
import {
	selectModificationPreviews,
	selectSelectedWeapon,
	selectUnsavedModifications,
} from "client/store/customization";
import { selectInventoryItems } from "client/store/inventory";
import { useRem } from "client/ui/hooks";
import { Button } from "client/ui/library/button/button";

export function ActionButton() {
	const rem = useRem();

	const unsavedAttachments = useSelector(selectUnsavedModifications);
	const previewingAttachments = useSelector(selectModificationPreviews);
	const selectedWeapon = useSelector(selectSelectedWeapon)!;
	const inventoryItems = useSelector(selectInventoryItems);
	const inventoryItem = inventoryItems.find((item) => item.Name === selectedWeapon.baseTool.Name);
	const hasSelectedWeapon = inventoryItem !== undefined;

	return (
		<Button
			text={
				unsavedAttachments.size() > 0
					? "Save Changes"
					: hasSelectedWeapon
					? "Unequip " + selectedWeapon.baseTool.Name
					: "Equip " + selectedWeapon.baseTool.Name
			}
			position={new UDim2(0, rem(45), 0.9, 0)}
			backgroundTransparency={0}
			backgroundColor={Color3.fromRGB(0, 0, 0)}
			borderColor={Color3.fromRGB(255, 255, 255)}
			borderSize={1}
			textColor={Color3.fromRGB(255, 255, 255)}
			fontFace={Font.fromEnum(Enum.Font.Highway)}
			textSize={rem(2)}
			size={UDim2.fromOffset(rem(12.5), rem(2.5))}
			event={{
				MouseButton1Click: () => {
					if (unsavedAttachments.size() > 0) {
						Log.Warn("Saving attachment data to weapon and player profile");
						Log.Info("Previewing attachments: {@Attachments}", previewingAttachments);
						Events.UpdateFirearm.fire(selectedWeapon.baseTool, previewingAttachments);
						clientStore.clearUnsavedModifications();
						return;
					}

					if (hasSelectedWeapon) {
						Events.UnequipFirearm.fire(inventoryItem);
						clientStore.removeInventoryItem(selectedWeapon.baseTool);
					} else {
						Events.EquipFirearm.fire(selectedWeapon.baseTool);
						clientStore.addInventoryItem(selectedWeapon.baseTool);
					}
				},
			}}
		/>
	);
}
