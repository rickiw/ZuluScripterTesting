import { useSelector } from "@rbxts/react-reflex";
import Roact from "@rbxts/roact";
import { selectCharacterCustomizationPage } from "client/store/customization";
import { useRem } from "client/ui/hooks";
import { Frame } from "client/ui/library/frame";
import { CustomizeArmorPage } from "./pages/armor";
import { CustomizeCharacterPage } from "./pages/character";
import { CustomizeTeamsPage } from "./pages/teams";
import { CustomizeUniformPage } from "./pages/uniform";

export function CharacterCustomizationPageProvider() {
	const rem = useRem();

	const selectedPage = useSelector(selectCharacterCustomizationPage);

	return (
		<>
			<Frame
				position={UDim2.fromOffset(rem(0), rem(13))}
				size={new UDim2(1, 0, 1, -rem(23))}
				backgroundTransparency={1}
			>
				{selectedPage === "teams" && <CustomizeTeamsPage />}
				{selectedPage === "character" && <CustomizeCharacterPage />}
				{selectedPage === "uniform" && <CustomizeUniformPage />}
				{selectedPage === "armor" && <CustomizeArmorPage />}
			</Frame>
		</>
	);
}
