import * as ReactRoblox from "@rbxts/react-roblox";
import Roact from "@rbxts/roact";
import { ObjectStory } from "@rbxts/ui-labs";
import { Crosshair } from "client/ui/components/weapon/crosshair";
import { RootProvider } from "client/ui/providers/root-provider";

const Story: ObjectStory = {
	summary: "Weapon HUD",
	story: (props) => {
		return (
			<RootProvider>
				{/* <WeaponProvider /> */}
				<Crosshair />
			</RootProvider>
		);
	},
	react: Roact,
	reactRoblox: ReactRoblox,
	controls: {},
};
export = Story;
