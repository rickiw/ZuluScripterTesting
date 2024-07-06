import { useSelector } from "@rbxts/react-reflex";
import Roact from "@rbxts/roact";
import { selectWeaponCustomizationPage } from "client/store/customization";
import { useRem } from "client/ui/hooks";
import { Frame } from "client/ui/library/frame";
import { CustomizeMeleePage } from "./pages/melee";
import { CustomizeModificationsPage } from "./pages/modifications";
import { CustomizePrimaryPage } from "./pages/primary";
import { CustomizeSecondaryPage } from "./pages/secondary";

export function WeaponCustomizationPageProvider() {
	const rem = useRem();

	const selectedPage = useSelector(selectWeaponCustomizationPage);

	return (
		<>
			<Frame
				position={UDim2.fromOffset(rem(0), rem(13))}
				size={new UDim2(1, 0, 1, -rem(23))}
				backgroundTransparency={1}
			>
				{selectedPage === "primary" && <CustomizePrimaryPage />}
				{selectedPage === "secondary" && <CustomizeSecondaryPage />}
				{selectedPage === "melee" && <CustomizeMeleePage />}
				{selectedPage === "mods" && <CustomizeModificationsPage />}
			</Frame>
		</>
	);
}
