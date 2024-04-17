import { useSelector } from "@rbxts/react-reflex";
import Roact from "@rbxts/roact";
import { clientStore } from "client/store";
import { selectModifications } from "client/store/interaction";
import { UpgradeIndicator } from "../components/menu/upgrade-indicator";

export function UpgradeProvider() {
	const modifications = useSelector(selectModifications);

	return (
		<>
			{modifications.map((modification) => (
				<billboardgui
					key={modification.Name}
					Adornee={modification.Attachment}
					Size={UDim2.fromScale(0.4, 0.4)}
					AlwaysOnTop
					Active
				>
					<UpgradeIndicator
						modification={modification}
						clicked={() => {
							clientStore.setSelectedModification(modification);
						}}
					/>
				</billboardgui>
			))}
		</>
	);
}
