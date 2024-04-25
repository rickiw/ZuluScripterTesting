import * as ReactRoblox from "@rbxts/react-roblox";
import Roact from "@rbxts/roact";
import { WithControls } from "@rbxts/ui-labs";
import { RootProvider } from "client/ui/providers/root-provider";
import { SCPToggle } from "./scp-toggle";

const controls = {
	toggled: true,
};

const Story: WithControls<typeof controls> = {
	summary: "SCP Table UI",
	story: (props) => {
		return (
			<RootProvider>
				<SCPToggle
					active={props.controls.toggled}
					size={new UDim2(0, 40, 0, 40)}
					position={new UDim2(0, 0, 0, 0)}
				/>
			</RootProvider>
		);
	},
	react: Roact,
	reactRoblox: ReactRoblox,
	controls,
};
export = Story;
