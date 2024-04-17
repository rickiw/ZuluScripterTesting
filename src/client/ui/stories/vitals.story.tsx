import * as ReactRoblox from "@rbxts/react-roblox";
import Roact from "@rbxts/roact";
import { ObjectStory } from "@rbxts/ui-labs";
import { Vitals } from "../components/vitals/vitals";
import { RootProvider } from "../providers/root-provider";

const VitalsStory: ObjectStory = {
	summary: "This is a test story with <b>Rich text</b>",
	story: (props) => {
		return (
			<RootProvider>
				<Vitals />
			</RootProvider>
		);
	},
	react: Roact,
	reactRoblox: ReactRoblox,
	controls: {},
};

export = VitalsStory;
