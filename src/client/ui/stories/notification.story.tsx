import * as ReactRoblox from "@rbxts/react-roblox";
import Roact from "@rbxts/roact";
import { WithControls } from "@rbxts/ui-labs";
import { Notification } from "../components/notification";
import { RootProvider } from "../providers/root-provider";

const controls = {
	open: true,
	title: "Notification",
	subtitle: "Subtitle",
	content: "Content...",
};

const MenuStory: WithControls<typeof controls> = {
	summary: "This is a test story with <b>Rich text</b>",
	story: (props) => {
		return (
			<RootProvider>
				<Notification
					open={props.controls.open}
					title={props.controls.title}
					subtitle={props.controls.subtitle}
					content={props.controls.content}
				/>
			</RootProvider>
		);
	},
	react: Roact,
	reactRoblox: ReactRoblox,
	controls,
};

export = MenuStory;
