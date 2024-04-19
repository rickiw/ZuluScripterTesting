import * as ReactRoblox from "@rbxts/react-roblox";
import Roact from "@rbxts/roact";
import { ObjectStory } from "@rbxts/ui-labs";
import { OperatingSystemUI } from "client/ui/operating-system/operating-system-provider";
import { RootProvider } from "../providers/root-provider";

const operatingSystemStory: ObjectStory = {
	summary: "operating system ui",
	story: (props) => {
		return (
			<RootProvider>
				<OperatingSystemUI />
			</RootProvider>
		);
	},
	react: Roact,
	reactRoblox: ReactRoblox,
	controls: {},
};

export = operatingSystemStory;
