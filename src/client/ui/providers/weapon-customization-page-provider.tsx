import { useSelector } from "@rbxts/react-reflex";
import Roact from "@rbxts/roact";
import { selectWeaponCustomizationPage } from "client/store/customization";
import { useRem } from "client/ui/hooks";
import { Frame } from "client/ui/library/frame";
import { CustomizeAttachmentsPage } from "../components/customization/weapon/pages/attachments";
import { CustomizeMeleePage } from "../components/customization/weapon/pages/melee";
import { CustomizePrimaryPage } from "../components/customization/weapon/pages/primary";
import { CustomizeSecondaryPage } from "../components/customization/weapon/pages/secondary";

export function WeaponCustomizationPageProvider() {
	const rem = useRem();

	const selectedPage = useSelector(selectWeaponCustomizationPage);

	return (
		<>
			<Frame
				position={UDim2.fromOffset(rem(0), rem(17.5))}
				size={new UDim2(0, rem(45), 1, -rem(27.5))}
				backgroundTransparency={1}
			>
				{selectedPage === "primary" && <CustomizePrimaryPage />}
				{selectedPage === "secondary" && <CustomizeSecondaryPage />}
				{selectedPage === "melee" && <CustomizeMeleePage />}
				{selectedPage === "attachments" && <CustomizeAttachmentsPage />}
			</Frame>
		</>
	);
}
