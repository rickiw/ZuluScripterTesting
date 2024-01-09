import Log from "@rbxts/log";
import Roact from "@rbxts/roact";
import { Frame } from "../frame";
import { ButtonRow } from "./button-row";

interface MenuPage {
	visible: boolean;
	title: string;
}

export function MenuProvider() {
	const menuPages: MenuPage[] = ["Shop", "Objectives", "Clan", "Perks"].map((title) => ({ title, visible: false }));

	return (
		<>
			<Frame
				anchorPoint={new Vector2(0.5, 0.5)}
				backgroundTransparency={0.7}
				position={UDim2.fromScale(0.5, 0.5)}
				size={UDim2.fromScale(1, 1)}
			>
				<ButtonRow buttonPressed={(button) => Log.Warn("{@Button} was pressed", button)} />
			</Frame>

			{menuPages.map((page) => {})}
		</>
	);
}
