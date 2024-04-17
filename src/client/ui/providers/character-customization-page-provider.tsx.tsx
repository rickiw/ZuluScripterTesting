import { useSelector } from "@rbxts/react-reflex";
import Roact from "@rbxts/roact";
import { selectCharacterCustomizationPage } from "client/store/customization";
import { useRem } from "client/ui/hooks";
import { Frame } from "client/ui/library/frame";
import { CustomizeCharacterPage } from "../components/customization/character/pages/character";
import { CustomizeTeamsPage } from "../components/customization/character/pages/teams";
import { CustomizeUniformPage } from "../components/customization/character/pages/uniform";

export function CharacterCustomizationPageProvider() {
	const rem = useRem();

	const selectedPage = useSelector(selectCharacterCustomizationPage);

	return (
		<>
			<Frame
				position={UDim2.fromOffset(rem(0), rem(17.5))}
				size={new UDim2(0, rem(45), 1, -rem(27.5))}
				backgroundTransparency={1}
			>
				{selectedPage === "teams" && <CustomizeTeamsPage />}
				{selectedPage === "character" && <CustomizeCharacterPage />}
				{selectedPage === "uniform" && <CustomizeUniformPage />}
			</Frame>
		</>
	);
}
