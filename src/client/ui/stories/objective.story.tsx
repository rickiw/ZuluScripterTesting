import * as ReactRoblox from "@rbxts/react-roblox";
import Roact from "@rbxts/roact";
import { ObjectStory } from "@rbxts/ui-labs";
import { objectives } from "shared/constants/objectives";
import { ObjectiveMarker } from "../components/objective/objective-marker";
import { RootProvider } from "../providers/root-provider";

const MenuStory: ObjectStory = {
	summary: "This is a test story with <b>Rich text</b>",
	story: (props) => {
		return (
			<RootProvider>
				<ObjectiveMarker objective={objectives[4]} />
			</RootProvider>
		);
	},
	react: Roact,
	reactRoblox: ReactRoblox,
	controls: {},
};

export = MenuStory;
