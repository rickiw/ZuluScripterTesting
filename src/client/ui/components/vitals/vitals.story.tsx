import * as ReactRoblox from "@rbxts/react-roblox";
import Roact from "@rbxts/roact";
import { ObjectStory } from "@rbxts/ui-labs";
import { RootProvider } from "../../providers/root-provider";
import { Vitals } from "./vitals";

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
