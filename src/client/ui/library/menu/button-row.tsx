import Roact from "@rbxts/roact";
import { clientStore } from "client/store";
import { useRem } from "client/ui/hooks";
import { fonts } from "shared/constants/fonts";
import { Button } from "../button/button";
import { Frame } from "../frame";

export const buttons = ["Shop", "Objectives", "Clan", "Perks"] as const;

export function ButtonRow() {
	const rem = useRem();

	return (
		<Frame
			backgroundTransparency={1}
			position={new UDim2(0, rem(31), 0, rem(2))}
			size={new UDim2(0, rem(60), 0, rem(2))}
		>
			<uigridlayout
				CellPadding={UDim2.fromOffset(5, 5)}
				CellSize={UDim2.fromOffset(rem(12.5), rem(3))}
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
					textSize={rem(1.25)}
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
