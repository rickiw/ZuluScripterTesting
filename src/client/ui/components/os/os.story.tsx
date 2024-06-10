import * as ReactRoblox from "@rbxts/react-roblox";
import Roact from "@rbxts/roact";
import { WithControls } from "@rbxts/ui-labs";
import { clientStore } from "client/store";
import { RootProvider } from "client/ui/providers/root-provider";
import { OSProvider } from "./os-provider";

const controls = {
	isOpen: true,
	accessLevel: 4,
};

const Story: WithControls<typeof controls> = {
	summary: "OS UI",
	story: (props) => {
		clientStore.setAccessLevel(props.controls.accessLevel);
		clientStore.setupTeslaGates(["Gate A", "Gate B", "Gate C", "Gate D", "Gate E"]);
		clientStore.setupBlastDoors(["Door A", "Door B", "Door C", "Door D", "Door E"]);
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
		clientStore.setPlayerList([
			{ team: "MTF", members: ["Player1", "Player2", "Player3"] },
			{ team: "CI", members: ["Player4", "Player5", "Player6"] },
			{ team: "SCP", members: ["Player7", "Player8", "Player9"] },
			{ team: "SCD", members: ["Player10", "Player11", "Player12"] },
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
