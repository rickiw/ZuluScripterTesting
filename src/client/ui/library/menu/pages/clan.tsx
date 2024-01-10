import Roact from "@rbxts/roact";
import { Frame } from "../../frame";
import { SideInformation } from "../side-information";

export function ClanPage() {
	return (
		<>
			<SideInformation />
			<Frame
				size={UDim2.fromScale(1, 0.7)}
				position={UDim2.fromScale(0.5, 0.6)}
				anchorPoint={new Vector2(0.5, 0.5)}
			/>
		</>
	);
}
