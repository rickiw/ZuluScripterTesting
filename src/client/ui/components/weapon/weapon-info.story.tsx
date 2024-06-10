import * as ReactRoblox from "@rbxts/react-roblox";
import Roact from "@rbxts/roact";
import { ObjectStory } from "@rbxts/ui-labs";
import { Crosshair } from "client/ui/components/weapon/crosshair";
import { RootProvider } from "client/ui/providers/root-provider";
import { WeaponInfo } from "./weapon-info";

const Story: ObjectStory = {
	summary: "Weapon Info HUD",
	story: (props) => {
		return (
			<RootProvider>
				<WeaponInfo />
				<Crosshair />
			</RootProvider>
		);
	},
	react: Roact,
	reactRoblox: ReactRoblox,
	controls: {},
};
export = Story;
