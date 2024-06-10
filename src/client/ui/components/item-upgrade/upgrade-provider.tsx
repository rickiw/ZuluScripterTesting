import { useSelector } from "@rbxts/react-reflex";
import Roact from "@rbxts/roact";
import { clientStore } from "client/store";
import { selectModificationMounts } from "client/store/interaction";
import { UpgradeIndicator } from "../menu/upgrade-indicator";

export function UpgradeProvider() {
	const modificationMounts = useSelector(selectModificationMounts);

	return (
		<>
			{modificationMounts
				.filter((mount) => mount.FindFirstChild("Attachment") !== undefined)
				.map((modificationMount) => (
					<billboardgui
						key={modificationMount.Name}
						Adornee={modificationMount.Attachment}
						Size={UDim2.fromScale(0.4, 0.4)}
						AlwaysOnTop
						Active
					>
						<UpgradeIndicator
							modification={modificationMount}
							clicked={() => {
								clientStore.setSelectedModificationMount(modificationMount);
								clientStore.setWeaponCustomizationPage("mods");
							}}
						/>
					</billboardgui>
				))}
		</>
	);
}
