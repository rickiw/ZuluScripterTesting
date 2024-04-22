import { useSelector } from "@rbxts/react-reflex";
import Roact from "@rbxts/roact";
import { Functions } from "client/network";
import { selectActiveSection } from "client/store/terminal";
import { useRem } from "client/ui/hooks";
import { Group } from "client/ui/library/group";
import { Text } from "client/ui/library/text";
import { fonts } from "shared/constants/fonts";
import { palette } from "shared/constants/palette";
import {
	selectActiveAlarmCode,
	selectActiveAnnouncement,
	selectAlarmCodes,
	selectAnnouncements,
} from "shared/store/os";
import { SCPTable } from "../scp";
import { SCPToggleTableItem } from "../scp/table/scp-toggle-table-item";

const AlarmCodes = () => {
	const rem = useRem();
	const activeAlarm = useSelector(selectActiveAlarmCode);
	const alarmCodes = useSelector(selectAlarmCodes);
	return (
		<SCPTable layoutOrder={1} size={new UDim2(1, 0, 0, rem(10))} header="ALARMS">
			{alarmCodes.map((alarmCode) => (
				<SCPToggleTableItem
					text={`CODE ${alarmCode}`.upper()}
					active={alarmCode === activeAlarm}
					onClick={() => {
						Functions.SetAlarm(alarmCode);
					}}
				/>
			))}
		</SCPTable>
	);
};

const Announcements = () => {
	const rem = useRem();
	const activeAnnouncement = useSelector(selectActiveAnnouncement);
	const announcements = useSelector(selectAnnouncements);
	return (
		<SCPTable layoutOrder={2} size={new UDim2(1, 0, 0, rem(10))} header="ANNOUNCEMENTS">
			{announcements.map((announcement) => (
				<SCPToggleTableItem
					text={`${announcement} ANNOUNCEMENT`.upper()}
					active={announcement === activeAnnouncement}
					onClick={() => {
						Functions.SetAnnouncement(announcement);
					}}
				/>
			))}
		</SCPTable>
	);
};

export const AudioPage = ({ backgroundTransparency }: { backgroundTransparency?: Roact.Binding<number> | number }) => {
	const rem = useRem();
	const activeSection = useSelector(selectActiveSection);

	if (activeSection !== "audio") {
		return <></>;
	}

	return (
		<>
			<Group size={UDim2.fromOffset(rem(36), rem(30))} position={UDim2.fromOffset(rem(1), rem(11))}>
				<uilistlayout FillDirection={Enum.FillDirection.Vertical} Padding={new UDim(0, rem(1))} />
				<Text
					layoutOrder={1}
					text={"AUDIO SYSTEMS"}
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
				<AlarmCodes />
				<Announcements />
			</Group>
			<Group
				size={UDim2.fromOffset(rem(34), rem(36))}
				position={new UDim2(1, -rem(3), 0, rem(3))}
				anchorPoint={new Vector2(1, 0)}
			>
				<uistroke Color={palette.white} Transparency={backgroundTransparency} />
			</Group>
		</>
	);
};
