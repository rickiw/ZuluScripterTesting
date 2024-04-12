import { useSelector } from "@rbxts/react-reflex";
import Roact from "@rbxts/roact";
import { selectSelectedCustomizationPage } from "client/store/customization";
import { useRem } from "client/ui/hooks";
import { Frame } from "client/ui/library/frame";
import { CustomizeCharacterPage } from "./pages/character";
import { CustomizeTeamsPage } from "./pages/teams";
import { CustomizeUniformPage } from "./pages/uniform";

export function CustomizationPageProvider() {
	const rem = useRem();

	const selectedPage = useSelector(selectSelectedCustomizationPage);

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
