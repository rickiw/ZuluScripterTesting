import * as ReactRoblox from "@rbxts/react-roblox";
import Roact from "@rbxts/roact";
import { WithControls } from "@rbxts/ui-labs";
import { Group } from "client/ui/library/group";
import { SCPTable } from "./scp-table";
import { SCPTextTableItem } from "./scp-text-table-item";
import { SCPToggleTableItem } from "./scp-toggle-table-item";

const controls = {
	isOpen: true,
	scrollable: true,
};

const Story: WithControls<typeof controls> = {
	summary: "SCP Table UI",
	story: (props) => {
		const items1 = ["item1", "item2", "item3"];
		const items2 = ["item1", "item2", "item3", "item4", "item5", "item6", "item7", "item8"];
		return (
			<Group size={new UDim2(0.5, 0, 0, 320)}>
				<uilistlayout
					FillDirection={Enum.FillDirection.Vertical}
					HorizontalAlignment={Enum.HorizontalAlignment.Left}
					VerticalAlignment={Enum.VerticalAlignment.Top}
				/>
				<SCPTable
					backgroundTransparency={0}
					size={new UDim2(1, 0, 0, 160)}
					header={"Test"}
					scrollable={props.controls.scrollable}
				>
					{items1.map((item, key) => {
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
				<SCPTable
					backgroundTransparency={0}
					size={new UDim2(1, 0, 0, 160)}
					header={"Test"}
					scrollable={props.controls.scrollable}
				>
					{items2.map((item, key) => {
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
