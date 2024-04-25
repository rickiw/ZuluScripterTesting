import { useEventListener } from "@rbxts/pretty-react-hooks";
import { useSelector } from "@rbxts/react-reflex";
import Roact, { useEffect, useState } from "@rbxts/roact";
import { RunService } from "@rbxts/services";
import { clientStore } from "client/store";
import { selectActiveNotification, selectNotifications } from "client/store/notifications";
import { Notification } from "../components/notification";

export function NotificationProvider() {
	const notifications = useSelector(selectNotifications);
	const activeNotification = useSelector(selectActiveNotification);
	const [open, setOpen] = useState(false);

	useEffect(() => {
		if (notifications.size() > 0 && activeNotification === undefined) {
			clientStore.popNotification();
		}
	}, [activeNotification, notifications]);

	useEventListener(RunService.Heartbeat, () => {
		setOpen(
			activeNotification !== undefined && (activeNotification.startTime ?? 0) + activeNotification.timer > tick(),
		);
		if (
			activeNotification !== undefined &&
			(activeNotification.startTime ?? 0) + activeNotification.timer + 1 < tick()
		) {
			clientStore.clearActiveNotification();
		}
	});

	return (
		<Notification
			title={activeNotification?.title}
			content={activeNotification?.content}
			subtitle={activeNotification?.subtitle}
			open={open}
		/>
	);
}
