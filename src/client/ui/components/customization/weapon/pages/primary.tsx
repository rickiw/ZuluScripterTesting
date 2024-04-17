import { useSelector } from "@rbxts/react-reflex";
import Roact from "@rbxts/roact";
import { selectWeapons } from "client/store/inventory";
import { useRem } from "client/ui/hooks";
import { ScrollingFrame } from "client/ui/library/frame";
import { WeaponSelector } from "../weapon-selector";

export function CustomizePrimaryPage() {
	const rem = useRem();

	const allWeapons = useSelector(selectWeapons);

	return (
		<>
			<ScrollingFrame size={UDim2.fromScale(1, 1)} backgroundTransparency={1} automaticSizing="Y">
				<uipadding PaddingTop={new UDim(0, rem(1.5))} />
				<uigridlayout
					CellSize={UDim2.fromOffset(rem(20), rem(12.5))}
					VerticalAlignment="Top"
					HorizontalAlignment="Center"
					CellPadding={UDim2.fromOffset(rem(1), rem(1))}
				/>

				{allWeapons
					.filter((weapon) => weapon.weaponType === "Primary")
					.sort((a, b) => a.baseTool.Name < b.baseTool.Name)
					.map((weapon) => (
						<WeaponSelector weapon={weapon} previewImage="handgun" />
					))}
			</ScrollingFrame>
		</>
	);
}
