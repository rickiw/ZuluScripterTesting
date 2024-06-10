import * as ReactRoblox from "@rbxts/react-roblox";
import Roact from "@rbxts/roact";
import { ObjectStory } from "@rbxts/ui-labs";
import { RootProvider } from "../../providers/root-provider";
import { MainMenuProvider } from "./main-menu-provider";

const MenuStory: ObjectStory = {
	summary: "Main Menu",
	story: (props) => {
		return (
			<RootProvider>
				<MainMenuProvider />
			</RootProvider>
		);
	},
	react: Roact,
	reactRoblox: ReactRoblox,
	controls: {},
};

export = MenuStory;
