import Roact, { useMemo } from "@rbxts/roact";
import { useRem } from "client/ui/hooks";
import { Frame } from "client/ui/library/frame";
import { Group } from "client/ui/library/group";
import { Text } from "client/ui/library/text";
import { fonts } from "shared/constants/fonts";
import { palette } from "shared/constants/palette";
import { SCPScrollingFrame } from "../scp";

interface PlayerListProps {
	position?: Roact.Binding<UDim2> | UDim2;
	size?: Roact.Binding<UDim2> | UDim2;
	backgroundTransparency?: Roact.Binding<number> | number;
	teamColor?: Color3;
	playerList: { team: string; members: string[] }[];
}

interface TeamListProps {
	team: string;
	members: string[];
	teamColor?: Color3;
	backgroundTransparency?: Roact.Binding<number> | number;
}

const TeamList = ({ team, members, teamColor, backgroundTransparency }: TeamListProps) => {
	const rem = useRem();
	return (
		<Group size={new UDim2(1, 0, 0, rem(2))} autoSize={Enum.AutomaticSize.Y}>
			<uilistlayout FillDirection={Enum.FillDirection.Vertical} />
			<Group size={new UDim2(1, 0, 0, rem(2.5))}>
				<Frame
					backgroundColor={teamColor ?? palette.active2}
					anchorPoint={new Vector2(0.5, 0.5)}
					position={UDim2.fromOffset(rem(0.5), rem(1))}
					size={UDim2.fromOffset(rem(0.5), rem(0.5))}
				/>
				<Text
					position={UDim2.fromOffset(rem(1.5), rem(1))}
					text={team}
					anchorPoint={new Vector2(0, 0.5)}
					size={new UDim2(0.9, 0, 0, rem(2.25))}
					textSize={rem(2)}
					textTransparency={0}
					textColor={palette.subtext1}
					backgroundTransparency={1}
					textXAlignment="Left"
					textYAlignment="Center"
					font={fonts.arimo.bold}
				/>
			</Group>
			{members.map((member, index) => (
				<Text
					text={member}
					key={"member" + index}
					size={new UDim2(1, 0, 0, rem(1.5))}
					textSize={rem(1.5)}
					textTransparency={backgroundTransparency}
					textColor={palette.subtext1}
					backgroundTransparency={1}
					textXAlignment="Left"
					textYAlignment="Center"
					font={fonts.arimo.regular}
				/>
			))}
		</Group>
	);
};

export const PlayerList = (props: PlayerListProps) => {
	const { backgroundTransparency = 0, playerList, teamColor = palette.active2 } = props;
	const rem = useRem();
	const playerColumn1 = useMemo(() => {
		const arr = [];
		for (let i = 0; i < playerList.size(); i++) {
			if (i % 2 === 0) {
				arr.push(playerList[i]);
			}
		}
		return arr;
	}, [playerList]);
	const playerColumn2 = useMemo(() => {
		const arr = [];
		for (let i = 0; i < playerList.size(); i++) {
			if (i % 2 === 1) {
				arr.push(playerList[i]);
			}
		}
		return arr;
	}, [playerList]);
	return (
		<SCPScrollingFrame
			size={props.size ?? new UDim2(1, 0, 1, 0)}
			backgroundTransparency={1}
			position={props.position}
		>
			<Group size={new UDim2(1, 0, 0, rem(6))} autoSize={Enum.AutomaticSize.Y}>
				<uilistlayout
					FillDirection={Enum.FillDirection.Horizontal}
					HorizontalAlignment={Enum.HorizontalAlignment.Center}
					Padding={new UDim(0, rem(1))}
				/>
				<Group size={new UDim2(0.5, -rem(1), 0, 0)} layoutOrder={1} autoSize={Enum.AutomaticSize.Y}>
					<uilistlayout
						FillDirection={Enum.FillDirection.Vertical}
						HorizontalAlignment={Enum.HorizontalAlignment.Left}
						Padding={new UDim(0, rem(1))}
					/>
					{playerColumn1.map((team, index) => (
						<TeamList
							{...team}
							backgroundTransparency={backgroundTransparency}
							teamColor={teamColor}
							key={index}
						/>
					))}
				</Group>
				<Group size={new UDim2(0.5, -rem(1), 0, 0)} layoutOrder={2} autoSize={Enum.AutomaticSize.Y}>
					<uilistlayout
						FillDirection={Enum.FillDirection.Vertical}
						HorizontalAlignment={Enum.HorizontalAlignment.Left}
						Padding={new UDim(0, rem(1))}
					/>
					{playerColumn2.map((team, index) => (
						<TeamList
							{...team}
							backgroundTransparency={backgroundTransparency}
							teamColor={teamColor}
							key={index}
						/>
					))}
				</Group>
			</Group>
		</SCPScrollingFrame>
	);
};
