import * as ReactRoblox from "@rbxts/react-roblox";
import Roact from "@rbxts/roact";
import { ObjectStory } from "@rbxts/ui-labs";
import { RootProvider } from "client/ui/providers/root-provider";
import { CustomizationProvider } from "../customization/customization-provider";

const Story: ObjectStory = {
	summary: "Weapon Customization UI",
	story: (props) => {
		return (
			<RootProvider>
				<CustomizationProvider />
			</RootProvider>
		);
	},
	react: Roact,
	reactRoblox: ReactRoblox,
	controls: {},
};
export = Story;
