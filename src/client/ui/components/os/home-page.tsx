import { useSelector } from "@rbxts/react-reflex";
import Roact from "@rbxts/roact";
import { selectActiveSection, selectPlayerList } from "client/store/terminal";
import { useRem } from "client/ui/hooks";
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
import { PlayerList } from "../playerList";
import { SCPScrollingFrame, SCPTable, SCPTextTableItem } from "../scp";

const ActivePersonnel = ({ backgroundTransparency }: { backgroundTransparency?: Roact.Binding<number> | number }) => {
	const rem = useRem();
	const playerList = useSelector(selectPlayerList);
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
			<PlayerList backgroundTransparency={backgroundTransparency} playerList={playerList} />
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
