import * as ReactRoblox from "@rbxts/react-roblox";
import Roact from "@rbxts/roact";
import { ObjectStory } from "@rbxts/ui-labs";
import { RootProvider } from "client/ui/providers/root-provider";
import { Customization } from "../customization/customization";

const Story: ObjectStory = {
	summary: "Weapon Customization UI",
	story: (props) => {
		return (
			<RootProvider>
				<Customization />
			</RootProvider>
		);
	},
	react: Roact,
	reactRoblox: ReactRoblox,
	controls: {},
};
export = Story;
