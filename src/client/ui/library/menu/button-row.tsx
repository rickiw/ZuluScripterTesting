import Roact from "@rbxts/roact";
import { ReactiveButton } from "../button/reactive";
import { Frame } from "../frame";

const buttons = ["Shop", "Objectives", "Clan", "Perks"] as const;

interface ButtonRowProps {
	buttonPressed: (button: (typeof buttons)[number]) => void;
}

export function ButtonRow({ buttonPressed }: ButtonRowProps) {
	return (
		<Frame
			backgroundTransparency={1}
			anchorPoint={new Vector2(0.5, 0.5)}
			position={UDim2.fromScale(0.6, 0.5)}
			size={UDim2.fromScale(0)}
		>
			<uigridlayout
				CellPadding={UDim2.fromOffset(5, 5)}
				CellSize={UDim2.fromOffset(120, 30)}
				FillDirection={Enum.FillDirection.Horizontal}
			/>
			{buttons.map((button) => (
				<ReactiveButton
					key={button.upper()}
					backgroundTransparency={0.6}
					onPress={() => buttonPressed(button)}
				/>
			))}
		</Frame>
	);
}
