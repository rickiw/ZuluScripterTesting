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
					<SCPTab title="PRIMARY 01" page="primary" icon="rifle" selectedIcon="rifleselected" />
					<SCPTab title="SECONDARY 02" page="secondary" icon="handgun" selectedIcon="handgunselected" />
					<SCPTab title="MELEE 03" page="melee" icon="knife" selectedIcon="knifeselected" />
					<SCPTab title="MODS 04" page="attachments" icon="attachments" selectedIcon="attachmentsselected" />
				</SCPTabs>
			</>
		);
	},
	react: Roact,
	reactRoblox: ReactRoblox,
	controls,
};
export = Story;
