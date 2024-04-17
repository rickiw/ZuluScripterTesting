import * as ReactRoblox from "@rbxts/react-roblox";
import Roact from "@rbxts/roact";
import { ObjectStory } from "@rbxts/ui-labs";
import { AerialProvider } from "client/ui/providers/aerial-provider"; //type constraint is not enforced, but it's recommended
import { RootProvider } from "client/ui/providers/root-provider";

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
