import Roact from "@rbxts/roact";
import { useRem } from "client/ui/hooks";
import { Frame } from "client/ui/library/frame";
import { images } from "shared/assets/images";
import { ButtonRowButton } from "./button-row-button";

export function CustomizationButtonRow() {
	const rem = useRem();

	return (
		<>
			<Frame
				position={UDim2.fromOffset(rem(0), rem(10.25))}
				size={UDim2.fromOffset(rem(45), rem(4.75))}
				backgroundTransparency={1}
				zIndex={2}
			>
				<uigridlayout
					CellPadding={UDim2.fromOffset(rem(1), rem(1))}
					CellSize={UDim2.fromOffset(rem(6), rem(5))}
				/>
				<ButtonRowButton title="TEAMS 01" page="teams" icon={images.ui.group} />
				<ButtonRowButton title="UNIFORM 02" page="character" icon={images.ui.pencil} />
				<ButtonRowButton title="UNIFORM 03" page="uniform" icon={images.ui.shirt} />
				<ButtonRowButton title="N/A 04" page="other" icon={images.ui.vest} />
			</Frame>
			<Frame
				zIndex={1}
				backgroundColor={Color3.fromRGB(33, 38, 41)}
				size={UDim2.fromOffset(rem(45), rem(2))}
				position={UDim2.fromOffset(rem(0), rem(15.25))}
			/>
		</>
	);
}
