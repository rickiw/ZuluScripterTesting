import * as ReactRoblox from "@rbxts/react-roblox";
import Roact from "@rbxts/roact";
import { WithControls } from "@rbxts/ui-labs";
import { clientStore } from "client/store";
import { RootProvider } from "client/ui/providers/root-provider";
import { NotificationProvider } from "../providers/notification-provider";

const controls = {
	isOpen: true,
};

const Story: WithControls<typeof controls> = {
	summary: "Notifications UI",
	story: (props) => {
		const runTestNotification = () => {
			clientStore.pushNotification({
				id: math.random(1, 9999),
				title: "Test Notification",
				content: "This is a test notification",
				timer: 5,
			});
		};

		runTestNotification();
		return (
			<RootProvider>
				<NotificationProvider />
			</RootProvider>
		);
	},
	react: Roact,
	reactRoblox: ReactRoblox,
	controls,
};
export = Story;
