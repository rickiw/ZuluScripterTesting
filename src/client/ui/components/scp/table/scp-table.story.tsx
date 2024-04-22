import * as ReactRoblox from "@rbxts/react-roblox";
import Roact from "@rbxts/roact";
import { WithControls } from "@rbxts/ui-labs";
import { SCPTable } from "./scp-table";
import { SCPTextTableItem } from "./scp-text-table-item";

const controls = {
	isOpen: true,
};

const Story: WithControls<typeof controls> = {
	summary: "SCP Table UI",
	story: (props) => {
		const items = ["item1", "item2", "item3", "item4", "item5"];
		return (
			<>
				<SCPTable backgroundTransparency={0} size={UDim2.fromScale(0.5, 1)} header={"Test"}>
					{items.map((item, key) => {
						return <SCPTextTableItem key={`item${key}`} text={item} onClick={() => print("item")} />;
					})}
				</SCPTable>
			</>
		);
	},
	react: Roact,
	reactRoblox: ReactRoblox,
	controls,
};
export = Story;
