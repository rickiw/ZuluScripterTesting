import * as ReactRoblox from "@rbxts/react-roblox";
import Roact from "@rbxts/roact";
import { WithControls } from "@rbxts/ui-labs";
import { SCPCommandScreen } from "./scp-command-screen";

const controls = {
	text: "test",
};

const Story: WithControls<typeof controls> = {
	summary: "SCP Table UI",
	story: (props) => {
		return <SCPCommandScreen size={new UDim2(256, 0, 0, 512)} text={props.controls.text}></SCPCommandScreen>;
	},
	react: Roact,
	reactRoblox: ReactRoblox,
	controls,
};
export = Story;
