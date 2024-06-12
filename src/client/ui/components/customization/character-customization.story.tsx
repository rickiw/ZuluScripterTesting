import * as ReactRoblox from "@rbxts/react-roblox";
import Roact from "@rbxts/roact";
import { ObjectStory } from "@rbxts/ui-labs";
import { clientStore } from "client/store";
import { RootProvider } from "client/ui/providers/root-provider";
import { CharacterCustomization } from "./character/character-customization";

const Story: ObjectStory = {
	summary: "Weapon Customization UI",
	story: (props) => {
		clientStore.setCustomizationOpen(true);
		clientStore.setCustomizationPage("character");
		return (
			<RootProvider>
				<CharacterCustomization />
			</RootProvider>
		);
	},
	react: Roact,
	reactRoblox: ReactRoblox,
	controls: {},
};
export = Story;
