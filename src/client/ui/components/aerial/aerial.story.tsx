import * as ReactRoblox from "@rbxts/react-roblox";
import Roact from "@rbxts/roact";
import { ObjectStory } from "@rbxts/ui-labs";
import { RootProvider } from "client/ui/providers/root-provider";
import { AerialProvider } from "./aerial-provider"; //type constraint is not enforced, but it's recommended

const Story: ObjectStory = {
	summary: "Aerial indicator UI",
	story: (props) => {
		return (
			<RootProvider>
				<AerialProvider />
			</RootProvider>
		);
	},
	react: Roact,
	reactRoblox: ReactRoblox,
	controls: {},
};
export = Story;
