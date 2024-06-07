import Roact from "@rbxts/roact";
import { useMotion, useRem } from "client/ui/hooks";
import { fonts } from "shared/constants/fonts";
import { palette } from "shared/constants/palette";
import { PlayerList } from "../components/playerList";
import { SCPScrollingFrame, SCPWindow } from "../components/scp";
import { Button, ButtonProps } from "../library/button/button";
import { Frame } from "../library/frame";
import { Group } from "../library/group";
import { Text } from "../library/text";

interface ServerButtonProps extends ButtonProps {
	serverName: string;
	playerCount: number;
	maxPlayer: number;
}

const ServerButton = (props: ServerButtonProps) => {
	const { serverName, playerCount, maxPlayer } = props;
	const rem = useRem();
	const [hover, hoverMotion] = useMotion(0);

	return (
		<Button
			text={props.text}
			textXAlignment="Left"
			textSize={rem(2)}
			onClick={props.onClick}
			fontFace={fonts.gothic.regular}
			textColor={palette.subtext1}
			size={new UDim2(1, 0, 0, rem(7))}
			onMouseEnter={() => hoverMotion.spring(1)}
			onMouseLeave={() => hoverMotion.spring(0)}
			backgroundColor={hover.map((value) => {
				return palette.surface0.Lerp(palette.surface1, value);
			})}
		>
			<Text
				position={UDim2.fromOffset(rem(0.5), rem(0.5))}
				text={serverName}
				anchorPoint={new Vector2(0, 0)}
				size={new UDim2(1, 0, 0, rem(2))}
				textSize={rem(2.5)}
				textTransparency={0}
				textColor={palette.subtext1}
				backgroundTransparency={1}
				textXAlignment="Left"
				textYAlignment="Center"
				font={fonts.arimo.bold}
			/>
			<Text
				position={UDim2.fromOffset(rem(0.5), rem(3))}
				text={`${playerCount}/${maxPlayer} ONLINE`}
				anchorPoint={new Vector2(0, 0)}
				size={new UDim2(1, 0, 0, rem(1))}
				textSize={rem(1.5)}
				textTransparency={0}
				textColor={palette.subtext1}
				backgroundTransparency={1}
				textXAlignment="Left"
				textYAlignment="Center"
				font={fonts.arimo.bold}
			/>
		</Button>
	);
};

const ServerList = () => {
	const rem = useRem();
	return (
		<Group size={new UDim2(0, rem(44), 1, -rem(5))} position={new UDim2(0, rem(3), 0, rem(3))}>
			<SCPScrollingFrame size={new UDim2(1, 0, 1, 0)} backgroundTransparency={1}>
				<uilistlayout FillDirection={Enum.FillDirection.Vertical} Padding={new UDim(0, rem(1))} />
				<ServerButton serverName={"Server 1"} playerCount={10} maxPlayer={20} />
				<ServerButton serverName={"Server 2"} playerCount={10} maxPlayer={20} />
				<ServerButton serverName={"Server 3"} playerCount={10} maxPlayer={20} />
				<ServerButton serverName={"Server 4"} playerCount={10} maxPlayer={20} />
			</SCPScrollingFrame>
		</Group>
	);
};

const SelectedServer = () => {
	const rem = useRem();
	const [hover, hoverMotion] = useMotion(0);
	const playerList = [
		{ team: "MTF", members: ["Player1", "Player2", "Player3"] },
		{ team: "CI", members: ["Player4", "Player5", "Player6"] },
		{ team: "SCP", members: ["Player7", "Player8", "Player9"] },
		{ team: "SCD", members: ["Player10", "Player11", "Player12"] },
	];
	return (
		<Frame
			size={new UDim2(0, rem(39), 1, -rem(5))}
			position={new UDim2(0, rem(48.75), 0, rem(3))}
			backgroundColor={palette.surface1}
		>
			<Frame size={new UDim2(0, rem(0.75), 1, 0)} backgroundColor={palette.accent_blue} />
			<Text
				position={UDim2.fromOffset(rem(3), rem(3))}
				text={"PLAYER LIST"}
				anchorPoint={new Vector2(0, 0.5)}
				size={new UDim2(0.9, 0, 0, rem(1.5))}
				textSize={rem(2)}
				textTransparency={0}
				textColor={palette.subtext1}
				backgroundTransparency={1}
				textXAlignment="Left"
				textYAlignment="Center"
				font={fonts.arimo.bold}
			/>
			<PlayerList
				playerList={playerList}
				size={UDim2.fromOffset(rem(35), rem(32))}
				position={UDim2.fromOffset(rem(2.5), rem(6))}
				teamColor={palette.accent_blue}
			/>
			<Button
				text={"JOIN"}
				textXAlignment="Center"
				textSize={rem(2)}
				onClick={() => {}}
				anchorPoint={new Vector2(0.5, 1)}
				position={new UDim2(0.5, 0, 1, -rem(2))}
				fontFace={fonts.gothic.regular}
				textColor={palette.subtext1}
				size={new UDim2(0, rem(18), 0, rem(4))}
				onMouseEnter={() => hoverMotion.spring(1)}
				onMouseLeave={() => hoverMotion.spring(0)}
				backgroundColor={hover.map((value) => {
					return palette.surface0.Lerp(palette.accent_blue, value);
				})}
			/>
		</Frame>
	);
};

export function ServerSelectProvider() {
	const rem = useRem();

	return (
		<SCPWindow noBorder size={new UDim2(0, rem(90), 0, rem(50.5))} isOpen={true} onClose={() => {}}>
			<ServerList />
			<SelectedServer />
		</SCPWindow>
	);
}
