import Roact from "@rbxts/roact";
import { Modification } from "client/store/interaction";
import { useMotion, useRem } from "client/ui/hooks";
import { springs } from "shared/constants/springs";

interface UpgradeIndicatorProps {
	modification: Modification;
}

export function UpgradeIndicator({ modification }: UpgradeIndicatorProps) {
	const rem = useRem();

	const [indicatorSize, indicatorSizeMotion] = useMotion(UDim2.fromScale(0.8, 0.8));

	return (
		<>
			<textbutton
				BackgroundTransparency={0.5}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={UDim2.fromScale(0.5, 0.5)}
				BackgroundColor3={Color3.fromRGB(22, 233, 56)}
				Size={indicatorSize}
				TextColor3={Color3.fromRGB(255, 255, 255)}
				Text={modification.part.Name}
				TextScaled
				Event={{
					MouseEnter: () => {
						indicatorSizeMotion.spring(UDim2.fromScale(1, 1), springs.bubbly);
					},
					MouseLeave: () => {
						indicatorSizeMotion.spring(UDim2.fromScale(0.8, 0.8), springs.bubbly);
					},
					MouseButton1Click: () => {},
				}}
			></textbutton>
		</>
	);
}
