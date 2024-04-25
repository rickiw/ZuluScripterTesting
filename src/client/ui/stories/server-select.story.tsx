import * as ReactRoblox from "@rbxts/react-roblox";
import Roact from "@rbxts/roact";
import { ObjectStory } from "@rbxts/ui-labs";
import { RootProvider } from "../providers/root-provider";
import { ServerSelectProvider } from "../providers/server-select-provider";

const MenuStory: ObjectStory = {
	summary: "Select Server",
	story: (props) => {
		return (
			<RootProvider>
				<ServerSelectProvider />
			</RootProvider>
		);
	},
	react: Roact,
	reactRoblox: ReactRoblox,
	controls: {},
};

export = MenuStory;
