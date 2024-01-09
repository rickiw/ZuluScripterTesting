import Roact from "@rbxts/roact";
import { clientStore } from "client/store";
import { fonts } from "shared/constants/fonts";
import { Button } from "../button/button";
import { Frame } from "../frame";

export const buttons = ["Shop", "Objectives", "Clan", "Perks"] as const;

export function ButtonRow() {
	return (
		<Frame
			backgroundTransparency={1}
			anchorPoint={new Vector2(0.5, 0.5)}
			position={UDim2.fromScale(0.8, 0.5)}
			size={UDim2.fromScale(1, 1)}
		>
			<uigridlayout
				CellPadding={UDim2.fromOffset(5, 5)}
				CellSize={UDim2.fromOffset(120, 30)}
				FillDirection={Enum.FillDirection.Horizontal}
			/>
			{buttons.map((button) => (
				<Button
					key={button.upper()}
					text={button.upper()}
					backgroundColor={Color3.fromRGB(0, 0, 0)}
					backgroundTransparency={0.6}
					borderColor={Color3.fromRGB(255, 255, 255)}
					borderSize={1}
					textColor={Color3.fromRGB(255, 255, 255)}
					textSize={20}
					textWrapped={true}
					fontFace={fonts.gothic.regular}
					event={{
						MouseButton1Up: () => clientStore.setMenuPage(button),
					}}
				></Button>
			))}
		</Frame>
	);
}
