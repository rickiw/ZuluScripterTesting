import * as ReactRoblox from "@rbxts/react-roblox";
import Roact from "@rbxts/roact";
import { ObjectStory } from "@rbxts/ui-labs";
import { Customization } from "client/ui/customization/customization";
import { RootProvider } from "client/ui/providers/root-provider";

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
