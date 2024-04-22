import * as ReactRoblox from "@rbxts/react-roblox";
import Roact from "@rbxts/roact";
import { WithControls } from "@rbxts/ui-labs";
import { clientStore } from "client/store";
import { RootProvider } from "client/ui/providers/root-provider";
import { OSProvider } from "../providers/os-provider";

const controls = {
	isOpen: true,
};

const Story: WithControls<typeof controls> = {
	summary: "OS UI",
	story: (props) => {
		clientStore.setupTeslaGates(["Gate A", "Gate B", "Gate C"]);
		clientStore.setupBlastDoors(["Door A", "Door B", "Door C"]);
		clientStore.setDocuments([
			{
				filename: "SCP-001",
				contents: "SCP-001 is a humanoid entity that is capable of manipulating reality.",
				author: "Dr. Bright",
			},
			{
				filename: "SCP-002",
				contents: "SCP-002 is a wooden desk that is capable of producing infinite paper.",
				author: "Dr. Bright",
			},
			{
				filename: "SCP-003",
				contents: "SCP-003 is a sentient entity that is capable of manipulating reality.",
				author: "root",
			},
		]);
		clientStore.setTerminalOpen(props.controls.isOpen);
		return (
			<RootProvider>
				<OSProvider />
			</RootProvider>
		);
	},
	react: Roact,
	reactRoblox: ReactRoblox,
	controls,
};
export = Story;
