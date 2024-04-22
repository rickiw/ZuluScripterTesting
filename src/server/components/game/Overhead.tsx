/**
 * @author </Nexus_Prime>
 * @description In case needed help to understand, go to https://nexusprime.vercel.app
 */

import Roact from "@rbxts/roact";
import { fonts } from "shared/constants/fonts";

export function Overhead({ PlayerName }: { PlayerName: string }) {
	return (
		<billboardgui key="OverheadUI" Size={new UDim2(4, 0, 2, 0)} StudsOffset={new Vector3(0, 2, 0)}>
			<uilistlayout
				FillDirection={Enum.FillDirection.Vertical}
				HorizontalAlignment={Enum.HorizontalAlignment.Center}
				VerticalAlignment={Enum.VerticalAlignment.Center}
			/>
			<textlabel
				key="PlayerName"
				Text={PlayerName}
				FontFace={fonts.gothic.bold}
				TextColor3={new BrickColor("White").Color}
				Size={new UDim2(1, 0, 0, 25)}
				BackgroundTransparency={1}
				TextTransparency={1}
				TextSize={18}
			/>
			<textlabel
				key="PlayerRank"
				FontFace={fonts.gothic.regular}
				Size={new UDim2(1, 0, 0, 15)}
				BackgroundTransparency={1}
				Text=""
				TextTransparency={1}
				TextSize={14}
			/>
		</billboardgui>
	);
}

const injectOverhead = (player: Player) => {
	warn("INJECT OVERHEAD");
	const character = player.Character ?? player.CharacterAdded.Wait()[0];
	const head = character.FindFirstChild("Head")!;

	Roact.mount(<Overhead PlayerName={player.DisplayName} />, head);
};

export default injectOverhead;
