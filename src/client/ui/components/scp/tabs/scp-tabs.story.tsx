import * as ReactRoblox from "@rbxts/react-roblox";
import Roact from "@rbxts/roact";
import { WithControls } from "@rbxts/ui-labs";
import { SCPTab, SCPTabs } from "./scp-tabs";

const controls = {
	isOpen: true,
};

const Story: WithControls<typeof controls> = {
	summary: "SCP Table UI",
	story: (props) => {
		return (
			<>
				<SCPTabs>
					<SCPTab page="PRIMARY" index={1} icon="rifle" />
					<SCPTab page="SECONDARY" index={2} icon="handgun" />
					<SCPTab page="MELEE" index={3} icon="knife" />
					<SCPTab page="MODS" index={4} icon="attachments" />
				</SCPTabs>
			</>
		);
	},
	react: Roact,
	reactRoblox: ReactRoblox,
	controls,
};
export = Story;
