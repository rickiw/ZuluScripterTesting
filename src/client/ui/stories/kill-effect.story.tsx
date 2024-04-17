import * as ReactRoblox from "@rbxts/react-roblox";
import Roact from "@rbxts/roact";
import { ObjectStory } from "@rbxts/ui-labs";
import { RootProvider } from "client/ui/providers/root-provider";
import { KillEffectProvider } from "../providers/kill-effect-provider";

const Story: ObjectStory = {
	summary: "Kill effect UI",
	story: (props) => {
		return (
			<RootProvider>
				<KillEffectProvider />
			</RootProvider>
		);
	},
	react: Roact,
	reactRoblox: ReactRoblox,
	controls: {},
};
export = Story;
