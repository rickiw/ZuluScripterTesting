import * as ReactRoblox from "@rbxts/react-roblox";
import Roact from "@rbxts/roact";
import { ObjectStory } from "@rbxts/ui-labs";
import { RootProvider } from "../../providers/root-provider";
import { MenuProvider } from "./menu-provider";

const MenuStory: ObjectStory = {
	summary: "This is a test story with <b>Rich text</b>",
	story: (props) => {
		return (
			<RootProvider>
				<MenuProvider />
			</RootProvider>
		);
	},
	react: Roact,
	reactRoblox: ReactRoblox,
	controls: {},
};

export = MenuStory;
