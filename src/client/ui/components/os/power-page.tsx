import { useSelector } from "@rbxts/react-reflex";
import Roact, { useState } from "@rbxts/roact";
import { RunService } from "@rbxts/services";
import { Functions } from "client/network";
import { selectActiveSection } from "client/store/terminal";
import { useRem } from "client/ui/hooks";
import { Group } from "client/ui/library/group";
import { Text } from "client/ui/library/text";
import { fonts } from "shared/constants/fonts";
import { palette } from "shared/constants/palette";
import { selectBlastDoorStatuses, selectTeslaGateStatuses } from "shared/store/os";
import { SCPCommandScreen, SCPScrollingFrame, SCPTable } from "../scp";
import { SCPToggleTableItem } from "../scp/table/scp-toggle-table-item";

const TeslaGates = ({ setLastCommand }: { setLastCommand: (str: string) => void }) => {
	const rem = useRem();
	const teslaStatuses = useSelector(selectTeslaGateStatuses);

	return (
		<SCPTable layoutOrder={1} size={new UDim2(1, 0, 0, rem(10))} header="TESLA GATE">
			{teslaStatuses.map(([gate, status]) => (
				<SCPToggleTableItem
					text={`TESLA ${gate}`.upper()}
					active={status}
					onClick={() => {
						setLastCommand(`TESLA_GATE %${gate}% ${!status ? "ACTIVE" : "INACTIVE"}`);
						if (RunService.IsRunning()) {
							Functions.SetTeslaGateStatus(gate, !status);
						}
					}}
				/>
			))}
		</SCPTable>
	);
};

const DoorControls = ({ setLastCommand }: { setLastCommand: (str: string) => void }) => {
	const rem = useRem();
	const blastDoorStatuses = useSelector(selectBlastDoorStatuses);

	return (
		<SCPTable layoutOrder={2} size={new UDim2(1, 0, 0, rem(10))} header="DOOR CONTROLS">
			{blastDoorStatuses.map(([gate, status]) => (
				<SCPToggleTableItem
					text={`${gate} BLAST DOORS`.upper()}
					active={status}
					onClick={() => {
						setLastCommand(`EXEC SET %${gate}% ${!status ? "OPEN" : "CLOSED"}`);
						if (RunService.IsRunning()) {
							Functions.SetDoorStatus(gate, !status);
						}
					}}
				/>
			))}
		</SCPTable>
	);
};

export const PowerPage = ({ backgroundTransparency }: { backgroundTransparency?: Roact.Binding<number> | number }) => {
	const rem = useRem();
	const [lastCommand, setLastCommand] = useState("ACCESS SUBSYSTEM POWER");
	const activeSection = useSelector(selectActiveSection);

	if (activeSection !== "power") {
		return <></>;
	}

	return (
		<>
			<Group size={UDim2.fromOffset(rem(36), rem(30))} position={UDim2.fromOffset(rem(1), rem(11))}>
				<Text
					layoutOrder={1}
					text={"ELECTRIC SYSTEMS"}
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
					<TeslaGates setLastCommand={setLastCommand} />
					<DoorControls setLastCommand={setLastCommand} />
				</SCPScrollingFrame>
			</Group>
			<Group
				size={UDim2.fromOffset(rem(34), rem(36))}
				position={new UDim2(1, -rem(3), 0, rem(3))}
				anchorPoint={new Vector2(1, 0)}
			>
				<uistroke Color={palette.white} Transparency={backgroundTransparency} />
				<SCPCommandScreen text={lastCommand} />
			</Group>
		</>
	);
};
