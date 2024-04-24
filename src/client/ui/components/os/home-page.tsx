import { useSelector } from "@rbxts/react-reflex";
import Roact, { useMemo } from "@rbxts/roact";
import { selectActiveSection, selectPlayerList } from "client/store/terminal";
import { useRem } from "client/ui/hooks";
import { Frame } from "client/ui/library/frame";
import { Group } from "client/ui/library/group";
import { Text } from "client/ui/library/text";
import { fonts } from "shared/constants/fonts";
import { palette } from "shared/constants/palette";
import {
	selectHumeStatus,
	selectPowerStatus,
	selectSectorStatuses,
	selectSectors,
	selectSeismicStatus,
	selectTeslaGateStatuses,
} from "shared/store/os";
import { SCPScrollingFrame, SCPTable, SCPTextTableItem } from "../scp";

const TeamList = ({ team, members, teamColor }: { team: string; members: string[]; teamColor: Color3 }) => {
	const rem = useRem();
	return (
		<Group size={new UDim2(1, 0, 0, rem(2))} autoSize={Enum.AutomaticSize.Y}>
			<uilistlayout FillDirection={Enum.FillDirection.Vertical} />
			<Group size={new UDim2(1, 0, 0, rem(2))}>
				<Frame
					backgroundColor={teamColor}
					anchorPoint={new Vector2(0.5, 0.5)}
					position={UDim2.fromOffset(rem(0.5), rem(1))}
					size={UDim2.fromOffset(rem(0.5), rem(0.5))}
				/>
				<Text
					position={UDim2.fromOffset(rem(1.5), rem(1))}
					text={team}
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
			</Group>
			{members.map((member, index) => (
				<Text
					text={member}
					key={"member" + index}
					size={new UDim2(1, 0, 0, rem(1.5))}
					textSize={rem(1.5)}
					textTransparency={0}
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

const ActivePersonnel = ({ backgroundTransparency }: { backgroundTransparency?: Roact.Binding<number> | number }) => {
	const rem = useRem();
	const playerList = useSelector(selectPlayerList);
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
		<Group
			size={new UDim2(1, -rem(1), 1, -rem(1))}
			position={new UDim2(0.5, 0, 0.5, 0)}
			anchorPoint={new Vector2(0.5, 0.5)}
		>
			<uilistlayout FillDirection={Enum.FillDirection.Vertical} Padding={new UDim(0, rem(2))} />
			<Text
				layoutOrder={0}
				text={"ACTIVE PERSONNEL LIST"}
				size={UDim2.fromOffset(rem(30), rem(1.5))}
				position={UDim2.fromOffset(rem(2), rem(2))}
				textColor={palette.subtext1}
				textSize={rem(1.5)}
				textTransparency={backgroundTransparency}
				backgroundTransparency={1}
				textWrapped={true}
				textXAlignment="Left"
				textYAlignment="Center"
				font={fonts.inter.extra}
			/>
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
						<TeamList {...team} key={index} />
					))}
				</Group>
				<Group size={new UDim2(0.5, -rem(1), 0, 0)} layoutOrder={2} autoSize={Enum.AutomaticSize.Y}>
					<uilistlayout
						FillDirection={Enum.FillDirection.Vertical}
						HorizontalAlignment={Enum.HorizontalAlignment.Left}
						Padding={new UDim(0, rem(1))}
					/>
					{playerColumn2.map((team, index) => (
						<TeamList {...team} key={index} />
					))}
				</Group>
			</Group>
		</Group>
	);
};

const FacilityStatus = () => {
	const rem = useRem();
	const powerActive = useSelector(selectPowerStatus);
	const humeActive = useSelector(selectHumeStatus);
	const seismicActive = useSelector(selectSeismicStatus);
	return (
		<SCPTable layoutOrder={4} size={new UDim2(1, 0, 0, rem(6))} header="FACILITY STATUS">
			<SCPTextTableItem text={`POWER: ${powerActive ? "NOMINAL" : "OFFLINE"}`} />
			<SCPTextTableItem text={`HUME: ${humeActive ? "NOMINAL" : "OFFLINE"}`} />
			<SCPTextTableItem text={`SEISMIC: ${seismicActive ? "NOMINAL" : "OFFLINE"}`} />
		</SCPTable>
	);
};

const TeslaStatus = () => {
	const rem = useRem();
	const teslaStatuses = useSelector(selectTeslaGateStatuses);
	return (
		<SCPTable layoutOrder={3} size={new UDim2(1, 0, 0, rem(6))} header="TESLA STATUS">
			{teslaStatuses.map(([name, status]) => (
				<SCPTextTableItem text={`GATE ${name}: ${status ? "ACTIVE" : "INACTIVE"}`.upper()} />
			))}
		</SCPTable>
	);
};

const SectorStatus = () => {
	const rem = useRem();
	const sectors = useSelector(selectSectorStatuses);
	return (
		<SCPTable layoutOrder={2} size={new UDim2(1, 0, 0, rem(6))} header="SECTOR STATUS">
			{sectors.map(([sector, status]) => (
				<SCPTextTableItem text={`${sector}: ${status}`.upper()} />
			))}
		</SCPTable>
	);
};

export const HomePage = ({ backgroundTransparency }: { backgroundTransparency?: Roact.Binding<number> | number }) => {
	const rem = useRem();
	const activeSection = useSelector(selectActiveSection);
	const sectors = useSelector(selectSectors);

	if (activeSection !== "home") {
		return <></>;
	}

	return (
		<>
			<Group size={UDim2.fromOffset(rem(36), rem(30))} position={UDim2.fromOffset(rem(1), rem(11))}>
				<Text
					layoutOrder={0}
					text={"GENERAL"}
					size={UDim2.fromOffset(rem(30), rem(1.5))}
					position={UDim2.fromOffset(rem(2), rem(2))}
					textColor={palette.subtext1}
					textSize={rem(1.5)}
					textTransparency={backgroundTransparency}
					backgroundTransparency={1}
					textWrapped={true}
					textXAlignment="Left"
					textYAlignment="Center"
					font={fonts.inter.extra}
				/>
				<SCPScrollingFrame
					size={new UDim2(1, -rem(2), 1, -rem(5))}
					position={new UDim2(0, rem(2), 0, rem(5))}
					backgroundTransparency={1}
				>
					<uilistlayout FillDirection={Enum.FillDirection.Vertical} Padding={new UDim(0, rem(2))} />
					<SectorStatus />
					<TeslaStatus />
					<FacilityStatus />
				</SCPScrollingFrame>
			</Group>
			<Group
				size={UDim2.fromOffset(rem(34), rem(36))}
				position={new UDim2(1, -rem(3), 0, rem(3))}
				anchorPoint={new Vector2(1, 0)}
			>
				<uistroke Color={palette.white} Transparency={backgroundTransparency} />
				<ActivePersonnel backgroundTransparency={backgroundTransparency} />
			</Group>
		</>
	);
};
