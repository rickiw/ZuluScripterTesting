import Object from "@rbxts/object-utils";
import { useSelector } from "@rbxts/react-reflex";
import Roact from "@rbxts/roact";
import { useRem } from "client/ui/hooks";
import { ScrollingFrame } from "client/ui/library/frame";
import { selectTeams } from "shared/store/teams";
import { TeamSelector } from "../team-selector";

export function CustomizeTeamsPage() {
	const rem = useRem();

	const teams = useSelector(selectTeams);

	return (
		<>
			<ScrollingFrame size={UDim2.fromScale(1, 1)} automaticSizing="Y" backgroundTransparency={1}>
				<uipadding
					PaddingTop={new UDim(0, rem(1))}
					PaddingBottom={new UDim(0, rem(1))}
					PaddingLeft={new UDim(0, rem(1))}
					PaddingRight={new UDim(0, rem(1))}
				/>
				<uigridlayout
					CellSize={new UDim2(1, 0, 0, rem(15.5))}
					CellPadding={UDim2.fromOffset(rem(1), rem(2.5))}
				/>
				{Object.values(teams).map((team) => (
					<TeamSelector team={team} />
				))}
			</ScrollingFrame>
		</>
	);
}
