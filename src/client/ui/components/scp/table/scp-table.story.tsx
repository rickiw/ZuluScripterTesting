import * as ReactRoblox from "@rbxts/react-roblox";
import Roact from "@rbxts/roact";
import { WithControls } from "@rbxts/ui-labs";
import { Group } from "client/ui/library/group";
import { SCPTable } from "./scp-table";
import { SCPTextTableItem } from "./scp-text-table-item";
import { SCPToggleTableItem } from "./scp-toggle-table-item";

const controls = {
	isOpen: true,
};

const Story: WithControls<typeof controls> = {
	summary: "SCP Table UI",
	story: (props) => {
		const items = ["item1", "item2", "item3", "item4", "item5"];
		return (
			<Group size={new UDim2(0.5, 0, 0.5, 0)}>
				<uilistlayout
					FillDirection={Enum.FillDirection.Vertical}
					HorizontalAlignment={Enum.HorizontalAlignment.Left}
					VerticalAlignment={Enum.VerticalAlignment.Top}
				/>
				<SCPTable backgroundTransparency={0} size={UDim2.fromScale(0.5, 1)} header={"Test"}>
					{items.map((item, key) => {
						return (
							<SCPTextTableItem
								key={`item${key}`}
								text={item}
								onClick={() => print("item")}
								subText="Test"
							/>
						);
					})}
				</SCPTable>
				<SCPTable backgroundTransparency={0} size={UDim2.fromScale(0.5, 1)} header={"Test"}>
					{items.map((item, key) => {
						return (
							<SCPToggleTableItem
								active={math.random(1, 2) === 1}
								key={`item${key}`}
								text={item}
								onClick={() => print("item")}
							/>
						);
					})}
				</SCPTable>
			</Group>
		);
	},
	react: Roact,
	reactRoblox: ReactRoblox,
	controls,
};
export = Story;
