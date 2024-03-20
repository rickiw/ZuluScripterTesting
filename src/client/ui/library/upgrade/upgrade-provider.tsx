import { useSelector } from "@rbxts/react-reflex";
import Roact from "@rbxts/roact";
import { selectModifications } from "client/store/interaction";
import { UpgradeIndicator } from "./upgrade-indicator";

export function UpgradeProvider() {
	const modifications = useSelector(selectModifications);

	return (
		<>
			{modifications.map((modification) => (
				<billboardgui
					key={modification.part.Name}
					Adornee={modification.attachment}
					Size={UDim2.fromScale(0.4, 0.4)}
					AlwaysOnTop
					Active
				>
					<UpgradeIndicator modification={modification} />
				</billboardgui>
			))}
		</>
	);
}
