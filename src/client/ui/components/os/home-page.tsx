import { useSelector } from "@rbxts/react-reflex";
import Roact from "@rbxts/roact";
import { selectActiveSection } from "client/store/terminal";
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
import { SCPTable, SCPTextTableItem } from "../scp";

const ActivePersonnel = () => {
	return <></>;
};

const FacilityStatus = () => {
	const rem = useRem();
	const powerActive = useSelector(selectPowerStatus);
	const humeActive = useSelector(selectHumeStatus);
	const seismicActive = useSelector(selectSeismicStatus);
	return (
		<SCPTable layoutOrder={4} size={new UDim2(1, 0, 0, rem(10))} header="FACILITY STATUS">
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
		<SCPTable layoutOrder={3} size={new UDim2(1, 0, 0, rem(10))} header="TESLA STATUS">
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
		<SCPTable layoutOrder={2} size={new UDim2(1, 0, 0, rem(10))} header="SECTOR STATUS">
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
				<uilistlayout FillDirection={Enum.FillDirection.Vertical} Padding={new UDim(0, rem(1))} />
				<Text
					layoutOrder={1}
					text={"GENERAL"}
					size={UDim2.fromOffset(rem(30), rem(1.5))}
					textColor={palette.subtext1}
					textSize={rem(1.5)}
					textTransparency={backgroundTransparency}
					backgroundTransparency={1}
					textWrapped={true}
					textXAlignment="Left"
					textYAlignment="Center"
					font={fonts.inter.extra}
				/>
				<SectorStatus />
				<TeslaStatus />
				<FacilityStatus />
			</Group>
			<Group
				size={UDim2.fromOffset(rem(34), rem(36))}
				position={new UDim2(1, -rem(3), 0, rem(3))}
				anchorPoint={new Vector2(1, 0)}
			>
				<uistroke Color={palette.white} Transparency={backgroundTransparency} />
				<ActivePersonnel />
			</Group>
		</>
	);
};
