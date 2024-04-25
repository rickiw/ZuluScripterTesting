import { useSelector } from "@rbxts/react-reflex";
import Roact from "@rbxts/roact";
import { selectActiveNotifications } from "client/store/notifications";
import { Notification } from "../components/notifications";

export function NotificationProvider() {
	const notifications = useSelector(selectActiveNotifications);

	return (
		<>
			{notifications.map((notification) => (
				<Notification notification={notification} />
			))}
		</>
	);
}
