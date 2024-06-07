import Roact from "@rbxts/roact";
import { useRem } from "client/ui/hooks";
import { Frame } from "client/ui/library/frame";
import { fonts } from "shared/constants/fonts";
import { TeamName } from "shared/constants/teams";

interface OverheadProps {
	playerName: string;
	teamName: TeamName;
}

export function Overhead({ playerName, teamName }: OverheadProps) {
	const rem = useRem();

	return (
		<>
			<Frame size={UDim2.fromScale(1, 1)} backgroundTransparency={1}>
				<uilistlayout
					FillDirection={Enum.FillDirection.Vertical}
					HorizontalAlignment={Enum.HorizontalAlignment.Center}
					VerticalAlignment={Enum.VerticalAlignment.Center}
					Padding={new UDim(0, rem(0.5))}
				/>
				<textlabel
					Text={playerName}
					FontFace={fonts.gothic.bold}
					TextColor3={Color3.fromRGB(255, 255, 255)}
					Size={new UDim2(1, 0, 0, rem(1.5))}
					BackgroundTransparency={1}
					TextSize={rem(2)}
				/>
				<textlabel
					FontFace={fonts.gothic.bold}
					Size={new UDim2(1, 0, 0, rem(1.5))}
					BackgroundTransparency={1}
					Text={teamName}
					TextSize={rem(1.5)}
				/>
			</Frame>
		</>
	);
}
