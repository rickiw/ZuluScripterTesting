import * as ReactRoblox from "@rbxts/react-roblox";
import Roact from "@rbxts/roact";
import { WithControls } from "@rbxts/ui-labs";
import { clientStore } from "client/store";
import { RootProvider } from "client/ui/providers/root-provider";
import { CookingProvider } from "../providers/cooking-provider";

const controls = {
	isOpen: true,
};

const Story: WithControls<typeof controls> = {
	summary: "Cooking UI",
	story: (props) => {
		clientStore.setCookingOpen(props.controls.isOpen);
		return (
			<RootProvider>
				<CookingProvider />
			</RootProvider>
		);
	},
	react: Roact,
	reactRoblox: ReactRoblox,
	controls,
};
export = Story;
